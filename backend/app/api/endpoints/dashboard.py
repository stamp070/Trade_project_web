from fastapi import APIRouter, Depends, HTTPException, Request
from app.core.security import get_current_user
from app.services.dashboard.dashboard_service import get_overview_data, get_account_detail,check_account_invoice
from app.services.dashboard.mt5 import create_token_mt5,create_account_mt5,delete_account_mt5
from app.services.dashboard.bot import disconnected_all_bots
from app.schema.mt5 import mt5_data,mt5_account

router = APIRouter()

# Dashboard Overview (all account)
@router.get("/overview")
def read_dashboard_overview(current_user = Depends(get_current_user)):
    # checking invoice status & Disconnected all bots if overdue
    invoice_status = check_account_invoice(current_user.id)
    if invoice_status["status"] == "overdue":
        disconnected_all_bots(current_user.id)

    # Main function
    data = get_overview_data(current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Overview not found")
    return data

# MT5 (display on dashboard)
@router.get("/account/{account_id}")
def read_account_detail(account_id: str, current_user = Depends(get_current_user)):

    # Main function
    data = get_account_detail(current_user.id, account_id)
    if not data:
        raise HTTPException(status_code=404, detail="Account not found")
    return data

@router.post("/create-token")
def create_token(token_mt5:mt5_data, current_user = Depends(get_current_user)):
    data = create_token_mt5(token_mt5)
    if not data:
        raise HTTPException(status_code=404, detail="Token not found")
    return data

@router.post("/create-account")
def create_account(mt5_account:mt5_account, current_user = Depends(get_current_user)):
    data = create_account_mt5(mt5_account,current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Account not found")
    return data

@router.delete("/delete-account/{mt5_id}")
def delete_account(mt5_id:str,current_user=Depends(get_current_user)):
    data = delete_account_mt5(mt5_id)
    if not data:
        raise HTTPException(status_code=404, detail="Account not found")
    return data

