from app.core.config import get_settings
from app.core.database import get_supabase_client
from fastapi import HTTPException

def get_admin_bottom_dashboard():
    supabase = get_supabase_client()
    data = supabase.table("profile").select("user_id,email,role,account_status,updated_at,mt5_accounts(mt5_id),invoice(commission_amount,status)").execute()

    return {"users":data.data}

def get_admin_top_dashboard():
    supabase = get_supabase_client()
    total_user = len(supabase.table("profile").select("user_id").execute().data)
    total_mt5_account = len(supabase.table("mt5_accounts").select("user_id").execute().data)
    commission = supabase.table("invoice").select("commission_amount").eq("status","paid").execute().data
    total_commission = sum(float(c['commission_amount']) for c in commission)
    
    
    return {"total_user":total_user,"total_mt5":total_mt5_account,"total_commission":total_commission}