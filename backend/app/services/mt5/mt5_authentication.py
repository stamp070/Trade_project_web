from app.core.database import get_supabase_client

def authentication(mt5_name, token):
    supabase = get_supabase_client()
    try:
        res = supabase.table("mt5_accounts").select("*").eq("mt5_name", mt5_name).eq("token", token).single().execute()
        if res and res.data:
            return res.data
        return None
    except Exception as e:
        return None
