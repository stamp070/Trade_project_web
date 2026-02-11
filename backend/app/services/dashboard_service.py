from app.core.database import get_supabase_client

def get_dashboard_data(user_id: str):
    supabase = get_supabase_client()
    
    # 1. Get Total Balance from MT5 Accounts
    accounts_response = supabase.table("mts_accounts").select("balance").eq("user_id", user_id).execute()
    total_balance = sum(account['balance'] for account in accounts_response.data) if accounts_response.data else 0.0

    # 2. Get Active Bots Count (Assuming 'RUNNING' or 'Active' status - checking 'bots' table)
    # We'll fetch all bots for the user first to be safe or rely on status
    bots_response = supabase.table("bots").select("bot_id, status").eq("user_id", user_id).execute()
    active_bots = sum(1 for bot in bots_response.data if bot['status'] in ['RUNNING', 'Active']) if bots_response.data else 0
    
    # Get all bot IDs for this user to filter transactions
    bot_ids = [bot['bot_id'] for bot in bots_response.data] if bots_response.data else []

    total_orders = 0
    total_wins = 0
    total_pnl = 0.0
    win_rate = 0.0

    if bot_ids:
        # 3. Get Transactions for these bots
        # Supabase 'in' filter for array of values
        transactions_response = supabase.table("transaction").select("profit_loss").in_("bot_id", bot_ids).execute()
        
        if transactions_response.data:
            transactions = transactions_response.data
            total_orders = len(transactions)
            total_pnl = sum(t['profit_loss'] for t in transactions)
            total_wins = sum(1 for t in transactions if t['profit_loss'] > 0)
            
            if total_orders > 0:
                win_rate = (total_wins / total_orders) * 100

    return {
        "balance": total_balance,
        "active_bots": active_bots,
        "total_orders": total_orders,
        "total_wins": total_wins,
        "win_rate": round(win_rate, 2),
        "total_pnl": total_pnl
    }