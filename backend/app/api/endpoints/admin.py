from fastapi import APIRouter, Depends, HTTPException
from app.services.admin.admin_dashboard import get_admin_top_dashboard,get_admin_bottom_dashboard
from app.core.security import get_current_user

router = APIRouter()

@router.get("/top-admin")
def get_top_dashboard(current_user = Depends(get_current_user)):
    data = get_admin_top_dashboard(current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Admin dashboard not found")
    print(data)
    return data

@router.get("/bottom-admin")
def get_bottom_dashboard(current_user = Depends(get_current_user)):
    data = get_admin_bottom_dashboard(current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Admin dashboard not found")
    print(data)
    return data