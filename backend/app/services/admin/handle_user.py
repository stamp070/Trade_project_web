from app.core.database import get_supabase_client

def banned_user(user_id:str):
    supabase = get_supabase_client()
    try:
        supabase.table("profile").update({"account_status": "banned"}).eq("user_id", user_id).execute()
        return {"status": "success", "message": "User has been banned successfully."}
    except Exception as e:
        return {"status": "error", "message": "Failed to ban user."}

def unbanned_user(user_id:str):
    supabase = get_supabase_client()
    try:
        supabase.table("profile").update({"account_status": "active"}).eq("user_id", user_id).execute()
        return {"status": "success", "message": "User has been unbanned successfully."}
    except Exception as e:
        return {"status": "error", "message": "Failed to unban user."}
