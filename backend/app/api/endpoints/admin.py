from fastapi import APIRouter, Depends, HTTPException
from app.services.admin.admin_dashboard import get_admin_top_dashboard,get_admin_bottom_dashboard
from app.services.admin.handle_user import banned_user,unbanned_user
from app.core.security import get_current_admin

router = APIRouter()

@router.get("/top-admin")
def get_top_dashboard(current_admin = Depends(get_current_admin)):
    data = get_admin_top_dashboard()
    if not data:
        raise HTTPException(status_code=404, detail="Admin dashboard not found")
    return data

@router.get("/bottom-admin")
def get_bottom_dashboard(current_admin = Depends(get_current_admin)):
    data = get_admin_bottom_dashboard()
    if not data:
        raise HTTPException(status_code=404, detail="Admin dashboard not found")
    return data

@router.post("/banned/{user_id}")
def post_banned_user(user_id:str,current_admin = Depends(get_current_admin)):
    data = banned_user(user_id)
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return data

@router.post("/unbanned/{user_id}")
def post_unbanned_user(user_id:str,current_admin = Depends(get_current_admin)):
    data = unbanned_user(user_id)
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    return data
