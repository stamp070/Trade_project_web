from app.core.database import get_supabase_client
from app.services.payment.payment_service import get_invoice_data
from datetime import datetime, timedelta, timezone

BKK_TZ = timezone(timedelta(hours=7))

"""
GET OVERVIEW DATA
"""
def get_overview_data(user_id: str):
    supabase = get_supabase_client()
    
    accounts = []
    transactions = []
    pnl_circle = []
    active_bots = 0
    total_balance = 0

    # 1. ยุบรวม (Accounts + Transactions + PnL Circle) ในการเรียก DB ครั้งเดียว
    try:
        response = supabase.table("mt5_accounts").select(
            "*, transaction(profit_loss, close_at, bot_id)"
        ).eq("user_id", user_id).order("balance", desc=True).execute()
        
        accounts_data = response.data if response.data else []
        
        for acc in accounts_data:
            acc_txs = acc.get('transaction', [])
            
            acc_info = {k: v for k, v in acc.items() if k != 'transaction'}
            accounts.append(acc_info)
            
            total_balance += acc_info.get('balance', 0)
            
            acc_pnl = sum(t['profit_loss'] for t in acc_txs)
            pnl_circle.append({
                'name': acc_info.get('account_name', 'Unknown'),
                'value': acc_pnl
            })
            
            transactions.extend(acc_txs)

        transactions = sorted(transactions, key=lambda x: x['close_at'])

    except Exception as e:
        print(f"Error fetching accounts and transactions: {e}")

    # 2. ดึงจำนวน Bot (แยกเรียกเพื่อดึงแค่ Count จะไวกว่าไปดึงข้อมูลมาทั้งหมด)
    try:
        bots_response = supabase.table("bots").select(
            "bot_id", count="exact"
        ).eq("user_id", user_id).eq("is_active", True).eq("connection", "Connected").execute()
        
        active_bots = bots_response.count if bots_response.count else 0
    except Exception as e:
        print(f"Error fetching active bots: {e}")

    # 3. คำนวณสถิติภาพรวมจากตัวแปรใน Memory (เร็วมาก ไม่ต้องพึ่ง DB แล้ว)
    total_orders = len(transactions)
    total_pnl = sum(t['profit_loss'] for t in transactions)
    total_wins = sum(1 for t in transactions if t['profit_loss'] > 0)
    win_rate = (total_wins / total_orders * 100) if total_orders > 0 else 0

    pnl_chart = _calculate_pnl_graph(transactions) if transactions else []

    return {
        "balance": total_balance,
        "active_bots": active_bots,
        "total_orders": total_orders,
        "total_wins": total_wins,
        "win_rate": round(win_rate, 2),
        "total_pnl": total_pnl,
        "accounts": accounts,
        "pnl_graph": pnl_chart,
        "pnl_circle": pnl_circle
    }

"""
GET MT5 ACCOUNT DETAIL DATA
"""

def get_account_detail(user_id: str, account_id: str):
    supabase = get_supabase_client()
    invoice_status = check_account_invoice(user_id)

    try:
        response = supabase.table("mt5_accounts").select(
            "*, bots(*, bots_version(version_name)), transaction(*, bots(currency))"
        ).eq("mt5_id", account_id).eq("user_id", user_id).maybe_single().execute()
        
        account = response.data
    except Exception as e:
        print(f"Error fetching account details: {e}")
        return None
    
    if not account:
        return None

    bots = account.get('bots') or []
    transactions = account.get('transaction') or []

    transactions.sort(key=lambda x: x.get('close_at') or '', reverse=True)

    total_orders = len(transactions)
    total_pnl = sum((t.get('profit_loss') or 0) for t in transactions)
    total_wins = sum(1 for t in transactions if (t.get('profit_loss') or 0) > 0)
    win_rate = (total_wins / total_orders * 100) if total_orders > 0 else 0
    active_bots_count = sum(1 for bot in bots if bot.get('connection') == 'ACTIVE')

    bots_data = []
    today = datetime.now(BKK_TZ).date()
    pnl_circle_map = {}
    
    for bot in bots:
        if currency not in pnl_circle_map:
            pnl_circle_map[currency] = 0

        bot_transactions = [t for t in transactions if t.get('bot_id') == bot.get('bot_id')]
        bot_trades_count = len(bot_transactions)
        bot_pnl = sum((t.get('profit_loss') or 0) for t in bot_transactions)
        
        today_pnl = sum((t.get('profit_loss') or 0) for t in bot_transactions if t.get('close_at') and datetime.fromisoformat(t['close_at'].replace('Z', '+00:00')).astimezone(BKK_TZ).date() == today)

        bots_version = bot.get('bots_version')
        version_name = bots_version.get('version_name', 'Unknown') if isinstance(bots_version, dict) else 'Unknown'

        bots_data.append({
            "bot_id": bot['bot_id'],
            "name": f"Bot {bot.get('currency', 'Unknown')}",
            "version": version_name,
            "pnl": bot_pnl,
            "today": today_pnl,
            "connection": bot['connection'],
            "is_active": bot['is_active'],
            "trades": bot_trades_count
        })


    recent_trades = []
    # transactions is desc for table
    for t in transactions:
        currency = "USD"
        if t.get('bots') and isinstance(t['bots'], dict):
             currency = t['bots'].get('currency', 'USD')
        elif t.get('bots') and isinstance(t['bots'], list) and len(t['bots']) > 0:
             currency = t['bots'][0].get('currency', 'USD')

        pnl_circle_map[currency] = pnl_circle_map.get(currency, 0) + float(t.get('profit_loss') or 0)
        
        recent_trades.append({
            "time": datetime.fromisoformat(t['close_at'].replace('Z', '+00:00')).astimezone(BKK_TZ).strftime("%Y-%m-%d %H:%M:%S") if t.get('close_at') else "-",
            "symbol": currency,
            "type": t.get('tradetype'),
            "volume": float(t.get('lotsize', 0)),
            "pnl": float(t.get('profit_loss', 0)),
        })
    transactions_ascending = sorted(transactions, key=lambda x: x.get('close_at'))
    pnl_chart = _calculate_pnl_graph(transactions_ascending)
    pnl_circle = [{'name': k, 'value': v} for k, v in pnl_circle_map.items()]

    return {
        "name": account['account_name'] or "Unnamed Account",
        "balance": float(account['balance']),
        "pnl": total_pnl,
        "invoice_status": invoice_status,
        "active_bots": active_bots_count,
        "win_rate": round(win_rate, 2),
        "total_orders": total_orders,
        "total_wins": total_wins,
        "bots": bots_data,
        "recent_trades": recent_trades[-40:],
        "pnl_graph": pnl_chart,
        "pnl_circle": pnl_circle,
    }

"""
CALCULATE PNL GRAPH
"""
def _calculate_pnl_graph(transactions, initial_balance=0):
    current_pnl = initial_balance
    pnl_curve = {} 

    for t in transactions:
        if t.get('close_at'):
            try:
                date_time = datetime.fromisoformat(t['close_at'].replace('Z', '+00:00')).astimezone(BKK_TZ)
                day = date_time.strftime("%Y-%m-%d") 
                
                current_pnl += float(t.get('profit_loss') or 0)
                pnl_curve[day] = current_pnl
            except Exception:
                pass

    return [{"day": k, "pnl": round(v,2)} for k, v in pnl_curve.items()]

"""
GET ACCOUNT INVOICE STATUS
"""
def check_account_invoice(user_id: str):
    try:
        supabase = get_supabase_client()
        now_bkk = datetime.now(BKK_TZ)

        # 1. เช็กเรื่องหนี้สินก่อน (มีความสำคัญสูงสุด)
        invoice_response = supabase.table("invoice").select("*").eq("user_id", user_id).in_("status", ["unpaid", "overdue"]).order("due_date", desc=False).execute()
        unpaid_invoices = invoice_response.data

        if unpaid_invoices:
            # หาบิลที่เก่าที่สุดเพื่อมาเตือน
            urgent_invoice = unpaid_invoices[0]
            status = urgent_invoice['status']
            
            if urgent_invoice.get('due_date'):
                invoice_due = datetime.fromisoformat(urgent_invoice['due_date'].replace('Z', '+00:00')).astimezone(BKK_TZ)
                day_left = max((invoice_due.date() - now_bkk.date()).days, 0)
            else:
                day_left = 0
            
            # Force overdue ถ้าวันหมดแล้ว
            if day_left == 0 and status == "unpaid":
                 status = "overdue"

            return {
                "status": status,
                "day_left": day_left,
                "date": urgent_invoice.get('due_date') or now_bkk.isoformat(),
            }

        # 2. ถ้าไม่มีหนี้ค้าง ให้ชี้ขาดว่ายังอยู่ในช่วง Trial หรือช่วงปกติ
        # ใช้ maybe_single() เพื่อป้องกัน Error ถ้าเผลอไม่มีข้อมูลในตาราง profile
        trial_response = supabase.table("profile").select("trial_end_date").eq("user_id", user_id).maybe_single().execute()
        trial_data = trial_response.data

        if trial_data and trial_data.get("trial_end_date"):
            trial_end_date = datetime.fromisoformat(trial_data['trial_end_date'].replace('Z', '+00:00')).astimezone(BKK_TZ)
            day_left = (trial_end_date.date() - now_bkk.date()).days
            
            if day_left >= 0:
                return {
                    "status": "trial",
                    "day_left": day_left,
                    "date": trial_data['trial_end_date'],
                }

        # 3. ถ้าพ้นทุกอย่างมาแล้วแสดงว่าเป็นคนปกติ Active
        next_month = now_bkk.replace(day=28) + timedelta(days=4)
        first_day_next_month = next_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        day_left = (first_day_next_month.date() - now_bkk.date()).days
        
        return {
            "status": "active",
            "day_left": day_left,
            "date": first_day_next_month.isoformat()
        }
    except Exception as e:
        print(f"Error checking invoice status: {e}")
        return {
            "status": "active",
            "day_left": 0,
            "date": datetime.now(BKK_TZ).isoformat()
        }