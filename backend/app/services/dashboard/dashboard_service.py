from app.core.database import get_supabase_client
from datetime import datetime, timedelta

def get_overview_data(user_id: str):
    supabase = get_supabase_client()
    
    # 1. Get Accounts
    accounts_response = supabase.table("mt5_accounts").select("*").eq("user_id", user_id).execute()
    accounts = accounts_response.data if accounts_response.data else []
    
    total_balance = sum(account['balance'] for account in accounts)

    # 2. Get All Bots for User (to calc active bots)
    bots_response = supabase.table("bots").select("bot_id, connection, mt5_id").eq("user_id", user_id).execute()
    active_bots = sum(1 for bot in bots_response.data if bot['connection'] in ['Connection']) if bots_response.data else 0
    bot_ids = [bot['bot_id'] for bot in bots_response.data] if bots_response.data else []


    if bot_ids:
        # Get aggregated stats from all bots
        response = supabase.table("transaction").select("profit_loss, close_at, bot_id").in_("bot_id", bot_ids).order("close_at").execute()
        transactions = response.data if response.data else []
        
        if transactions:
            total_orders = len(transactions)
            total_pnl = sum(t['profit_loss'] for t in transactions)
            total_wins = sum(1 for t in transactions if t['profit_loss'] > 0)
            
            if total_orders > 0:
                win_rate = (total_wins / total_orders) * 100

        
        # 1. Map Bot -> Account
        bot_to_account = {b['bot_id']: b.get('mt5_id') for b in bots_response.data}
        
        pnl_accumulator = {}
        for t in transactions:
            bot_id = t.get('bot_id')
            account_id = bot_to_account.get(bot_id)
            if account_id:
                pnl_accumulator[account_id] = round(pnl_accumulator.get(account_id, 0) + float(t['profit_loss']),2)

        
        # Inject PnL into accounts list
        for account in accounts:
            account['pnl'] = pnl_accumulator.get(account['mt5_id'], 0)  
            account['status'] = account['status']
        
    else:
        pnl_chart = [{"day": datetime.now().strftime("%d"), "pnl": float(total_balance)}]

    # 5. Prepare PnL Distribution (Chart Data)
    pnl_chart = _calculate_pnl_graph(transactions)
    pnl_distribution = _prepare_pnl_circle(accounts, 'account_name', 'pnl')

    return {
        "balance": total_balance,
        "active_bots": active_bots,
        "total_orders": total_orders,
        "total_wins": total_wins,
        "win_rate": round(win_rate, 2),
        "total_pnl": total_pnl,
        "accounts": accounts,
        "pnl_graph": pnl_chart,
        "pnl_circle": pnl_distribution
    }

def get_account_detail(user_id: str, account_id: str):
    supabase = get_supabase_client()

    # 1. Get Account Info
    account_response = supabase.table("mt5_accounts").select("*").eq("mt5_id", account_id).eq("user_id", user_id).single().execute()
    account = account_response.data
    
    if not account:
        return None

    # 2. Get Bots for this Account
    bots_response = supabase.table("bots").select("*, bots_version(version_name)").eq("mt5_id", account_id).execute()
    bots = bots_response.data if bots_response.data else []
    bot_ids = [bot['bot_id'] for bot in bots]

    # 3. Get Transactions for these bots
    transactions = []
    if bot_ids:
        # Fetch detailed transactions
        response = supabase.table("transaction").select("*, bots(currency)").in_("bot_id", bot_ids).order("close_at", desc=True).execute()
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
        bot_pnl = sum(t['profit_loss'] for t in bot_transactions)
        bot_trades_count = len(bot_transactions)
        
        today_pnl = sum(t['profit_loss'] for t in bot_transactions if t['close_at'] and datetime.fromisoformat(t['close_at'].replace('Z', '+00:00')).date() == today)

        version_name = bot.get('bots_version', {}).get('version_name', 'Unknown') if bot.get('bots_version') else 'Unknown'

        bots_data.append({
            "bot_id": bot['bot_id'],
            "name": f"Bot {bot.get('currency', 'Unknown')}",
            "version": version_name,
            "pnl": bot_pnl,
            "today": today_pnl,
            "connection": bot['connection'],
            "trades": bot_trades_count
        })

    pnl_distribution = _prepare_pnl_circle(bots_data, 'name', 'pnl')
    
    # Calculate Equity Curve for this account using transactions (need to sort asc for curve)
    transactions_asc = sorted(transactions, key=lambda x: x['close_at']) if transactions else []
    pnl_chart = _calculate_pnl_graph(transactions_asc)
    if not pnl_chart:
         pnl_chart = [{"day": datetime.now().strftime("%d"), "pnl": float(account['balance'])}]


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
        "pnl_circle": pnl_distribution,
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

def _prepare_pnl_circle(items, name_key, pnl_key):
    distribution = []
    for index, item in enumerate(items):
         val = item.get(pnl_key, 0)
         distribution.append({
            "name": item.get(name_key, 'Unknown'),
            "value": val,
        })
    return distribution
