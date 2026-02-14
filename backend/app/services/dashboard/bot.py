from app.core.database import get_supabase_client
from app.schema.bot import BotCreate

def create_bot_service(data: BotCreate, user_id: str):
    supabase = get_supabase_client()

    test = supabase.table("bots").select("").eq("currency",data.currency).eq("mt5_id",data.mt5_id).execute()
    print(data.mt5_id)
    if(test.data):
        return {"status":"Bots already exist"}

    try:
        response = supabase.table("bots").insert({
            "user_id": user_id,
            "mt5_id": data.mt5_id,
            "version_id": data.version_id,
            "currency": data.currency,
            "connection": "Disconected"
        }).execute()
        return {"status":"success"} if response.data[0] is not None else {"status":"error"}
    except Exception as e:
        print(f"Error creating bot: {e}")
        return None

def get_bot_service(user_id: str):
    supabase = get_supabase_client()
    
    # 1. Fetch all Bot Versions
    versions_res = supabase.table("bots_version").select("version_id, version_name").execute()
    versions = [{"id": v['version_id'], "label": v['version_name']} for v in versions_res.data] if versions_res.data else []

    # 2. Fetch User's MT5 Accounts
    accounts_res = supabase.table("mt5_accounts").select("mt5_id, account_name").eq("user_id", user_id).execute()
    accounts = [{"id": a['mt5_id'], "label": a['account_name'] or "Unnamed Account"} for a in accounts_res.data] if accounts_res.data else []

    return {
        "bots_version": versions,
        "mt5_accounts": accounts
    }

def update_bot_status(bot_id: str, connection: str):
    supabase = get_supabase_client()
    response = supabase.table('bots').update({'connection': connection }).eq('bot_id', bot_id).execute()
    
    return response.data
