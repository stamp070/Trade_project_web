from app.core.database import get_supabase_client
from datetime import datetime, timezone

def authentication(mt5_name, token):
    supabase = get_supabase_client()
    try:
        res = supabase.table("mt5_accounts").select("*").eq("mt5_name", mt5_name).eq("token", token).single().execute()
        if res and res.data:
            account = res.data
            user_id = account.get("user_id")
            
            if user_id:
                inv_res = supabase.table("invoice").select("status").eq("user_id", user_id).in_("status", ["overdue"]).execute()
                if inv_res.data and len(inv_res.data) > 0:
                    account["is_overdue"] = True
                else:
                    account["is_overdue"] = False
            return account
        return None
    except Exception as e:
        print(f"[authentication] Error: {e}")
        return None
