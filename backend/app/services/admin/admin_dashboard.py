from app.core.database import get_supabase_client

def get_admin_bottom_dashboard():
    supabase = get_supabase_client()
    data = supabase.table("profile").select("user_id,email,role,account_status,updated_at,mt5_accounts(mt5_id),invoice(status,due_date)")\
        .order("due_date", desc=True, foreign_table="invoice")\
        .limit(1, foreign_table="invoice")\
        .execute()

    total_account = sum(len(d['mt5_accounts']) for d in data.data)
    return {"users":data.data,"total_account":total_account}

def get_admin_top_dashboard():
    supabase = get_supabase_client()
    total_user = len(supabase.table("profile").select("user_id").execute().data)
    total_mt5_account = len(supabase.table("mt5_accounts").select("user_id").execute().data)
    commission = supabase.table("invoice").select("commission_amount").eq("status","paid").execute().data
    total_commission = sum(float(c['commission_amount']) for c in commission)
    
    
    return {"total_user":total_user,"total_mt5":total_mt5_account,"total_commission":total_commission}


def get_user_profile(user_id:str):
    supabase = get_supabase_client()
    profile_res = supabase.table("profile").select("email,role").eq("user_id",user_id).execute()
    mt5_res = supabase.table("mt5_accounts").select("balance").eq("user_id",user_id).execute()
    bot_res = supabase.table("bots").select("currency,connection,mt5_accounts(mt5_name)").eq("user_id",user_id).execute()
    invoice_res = supabase.table("invoice").select("commission_amount,status,created_at,due_date").eq("user_id",user_id).order("due_date",desc=True).execute()

    total_balance = sum(float(b['balance']) for b in mt5_res.data)
    print(profile_res)
    print(bot_res)
    return {"profile":profile_res.data,"balance":total_balance, "bots":bot_res.data,"invoice":invoice_res.data}