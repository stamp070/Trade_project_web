import hashlib
from app.schema.mt5 import mt5_data,mt5_account
from app.core.config import get_settings
from app.core.database import get_supabase_client

salt = get_settings().EA_SALT
def create_token_mt5(data: mt5_data):
    if data.mt5_name == "" or data.account_name == "":
        return {"token": "","status":"error"}
   
    raw = f"{data.mt5_name}:{data.account_name}:{salt}"
    try:
        hash = hashlib.sha256(raw.encode('utf-8')).hexdigest()
        short_token = hash[:20]
        return {"token": short_token,"status":"success"}
    except Exception as e:
        return {"token": "","status":"error"}

def create_account_mt5(data:mt5_account,user_id:str):
    supabase = get_supabase_client()
    res = supabase.table("mt5_accounts").select("*").eq("user_id",user_id).eq("mt5_name",data.mt5_name).execute()
    if res.data:
        return {"status":"already exists"}
    try:
        supabase.table("mt5_accounts").insert({
            "user_id":user_id,
            "token": data.token,
            "mt5_name": data.mt5_name,
            "account_name": data.account_name,
        }).execute()
        return {"status":"success"}

    except Exception as e:
        print(e)
        return {"status":"error"}