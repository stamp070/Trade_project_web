from app.core.database import get_supabase_client


def update_mt5_status(mt5_name: str, token: str, balance: str):
    supabase = get_supabase_client()
    try:
        res = supabase.table("mt5_accounts").update({"status": "Connected","balance": float(balance)}).eq("mt5_name", mt5_name).eq("token", token).execute()
        print(res)
        if res:
            return {"status": "success"}
        else:
            return {"status": "error"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
