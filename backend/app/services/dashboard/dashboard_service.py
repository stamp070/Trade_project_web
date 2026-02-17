from app.core.database import get_supabase_client
from datetime import datetime, timedelta

def get_overview_data(user_id: str):
    supabase = get_supabase_client()
    transactions = []
    accounts = []
    active_bots = 0

    # Get Accounts
    try:
        accounts_response = supabase.table("mt5_accounts").select("*").eq("user_id", user_id).execute()
        accounts = accounts_response.data if accounts_response.data else []
    except Exception as e:
        print(f"Error fetching accounts: {e}")

    total_balance = sum(account['balance'] for account in accounts)
    transactions = []
    
    # Get All active bots
    try:
        active_bots_response = supabase.table("bots").select("bot_id", count="exact").eq("user_id", user_id).eq("connection", "Connected").execute()
        active_bots = active_bots_response.count
    except Exception as e:
        print(f"Error fetching active bots: {e}")

    # Get All transactions
    try:
        response = supabase.table("transaction").select("profit_loss, close_at, bot_id").eq("user_id", user_id).order("close_at").execute()
        transactions = response.data
    except Exception as e:
        print(f"Error fetching transactions: {e}")
    
    total_orders = 0
    total_pnl = 0
    total_wins = 0
    win_rate = 0
    
    if transactions:
        total_orders = len(transactions)
        total_pnl = sum(t['profit_loss'] for t in transactions)
        total_wins = sum(1 for t in transactions if t['profit_loss'] > 0)
        
        if total_orders > 0:
            win_rate = (total_wins / total_orders) * 100

    # Get All pnl
    pnl_response = supabase.table("mt5_accounts").select("account_name, transaction(profit_loss)").eq("user_id", user_id).execute()
    summary = []
    for t in pnl_response.data:
        total = sum(t['profit_loss'] for t in t['transaction'])
        summary.append({
            'name': t['account_name'],
            'value': total
        })

    pnl_circle = summary
    pnl_chart = _calculate_pnl_graph(transactions)

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

def get_account_detail(user_id: str, account_id: str):
    supabase = get_supabase_client()

    # Get Account Info
    account_response = supabase.table("mt5_accounts").select("*").eq("mt5_id", account_id).eq("user_id", user_id).single().execute()
    account = account_response.data
    
    if not account:
        return None

    # Get Bots for this Account
    bots_response = supabase.table("bots").select("*, bots_version(version_name)").eq("mt5_id", account_id).execute()
    bots = bots_response.data if bots_response.data else []

    # Get Transactions for these bots
    transactions = []
    response = supabase.table("transaction").select("*, bots(currency)").eq("mt5_id", account_id).order("close_at", desc=True).execute()
    transactions = response.data if response.data else []

    # 4. Calculate Stats
    total_orders = len(transactions)
    total_pnl = sum(t['profit_loss'] for t in transactions)
    total_wins = sum(1 for t in transactions if t['profit_loss'] > 0)
    win_rate = (total_wins / total_orders * 100) if total_orders > 0 else 0
    active_bots_count = sum(1 for bot in bots if bot['connection'] == 'ACTIVE')

    # 5. Process Bot Performance
    bots_data = []
    today = datetime.now().date()
    
    for bot in bots:
        bot_transactions = [t for t in transactions if t['bot_id'] == bot['bot_id']]
        bot_trades_count = len(bot_transactions)
        bot_pnl = sum(t['profit_loss'] for t in bot_transactions)
        
        today_pnl = sum(t['profit_loss'] for t in bot_transactions if t['close_at'] and datetime.fromisoformat(t['close_at'].replace('Z', '+00:00')).date() == today)

        version_name = bot.get('bots_version', {}).get('version_name', 'Unknown')

        bots_data.append({
            "bot_id": bot['bot_id'],
            "name": f"Bot {bot.get('currency', 'Unknown')}",
            "version": version_name,
            "pnl": bot_pnl,
            "today": today_pnl,
            "connection": bot['connection'],
            "trades": bot_trades_count
        })

    # Get All pnl
    pnl_response = supabase.table("bots").select("currency, transaction(profit_loss)").eq("mt5_id", account_id).execute()
    summary = []
    for t in pnl_response.data:
        total = sum(t['profit_loss'] for t in t['transaction'])
        summary.append({
            'name': t['currency'],
            'value': total
        })
    pnl_circle = summary
    
    pnl_chart = _calculate_pnl_graph(transactions)


    recent_trades = []
    # transactions is desc for table
    for t in transactions:
        currency = "USD"
        if t.get('bots') and isinstance(t['bots'], dict):
             currency = t['bots'].get('currency', 'USD')
        elif t.get('bots') and isinstance(t['bots'], list) and len(t['bots']) > 0:
             currency = t['bots'][0].get('currency', 'USD')
        
        recent_trades.append({
            "time": datetime.fromisoformat(t['close_at'].replace('Z', '+00:00')).strftime("%Y-%m-%d %H:%M:%S") if t.get('close_at') else "-",
            "symbol": currency,
            "type": t.get('tradetype'),
            "volume": float(t.get('lotsize', 0)),
            "pnl": float(t.get('profit_loss', 0)),
        })

    return {
        "name": account['account_name'] or "Unnamed Account",
        "balance": float(account['balance']),
        "pnl": total_pnl,
        "due_date": 14, # MOCK
        "active_bots": active_bots_count,
        "win_rate": round(win_rate, 2),
        "total_orders": total_orders,
        "total_wins": total_wins,
        "bots": bots_data,
        "recent_trades": recent_trades[-10:],
        "pnl_graph": pnl_chart,
        "pnl_circle": pnl_circle,
    }
    

def _calculate_pnl_graph(transactions, initial_balance=0):
    current_pnl = initial_balance
    pnl_curve = {} 

    for t in transactions:
        if t.get('close_at'):
            date_time = datetime.fromisoformat(t['close_at'].replace('Z', '+00:00'))
            day = date_time.strftime("%Y-%m-%d") 
            
            current_pnl += float(t['profit_loss'])
            pnl_curve[day] = current_pnl

    return [{"day": k, "pnl": round(v,2)} for k, v in pnl_curve.items()]

