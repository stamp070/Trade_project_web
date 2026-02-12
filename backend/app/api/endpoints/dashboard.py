from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.services.dashboard_service import get_overview_data, get_account_detail

router = APIRouter()

@router.get("/")
def read_dashboard_overview(current_user = Depends(get_current_user)):
    return get_overview_data(current_user.id)

@router.get("/{account_id}")
def read_account_detail(account_id: str, current_user = Depends(get_current_user)):
    data = get_account_detail(current_user.id, account_id)
    if not data:
        raise HTTPException(status_code=404, detail="Account not found")
    return data
