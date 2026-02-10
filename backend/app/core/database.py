from supabase import create_client, Client
from app.core.config import get_settings

settings = get_settings()

supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_SERVICE_KEY
)

supabase_admin: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_SERVICE_KEY
)

def get_supabase_client() -> Client:
    return supabase

def get_supabase_admin_client() -> Client:
    return supabase_admin
