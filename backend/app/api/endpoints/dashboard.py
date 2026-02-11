from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.services.dashboard_service import get_dashboard_data

router = APIRouter()

@router.get("/")
def read_dashboard_data(current_user = Depends(get_current_user)):
    # current_user is the Supabase User object, it has an 'id' attribute
    return get_dashboard_data(current_user.id)
