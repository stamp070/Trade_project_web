from fastapi import APIRouter, Depends, HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.security import get_current_user
from app.services.dashboard.dashboard_service import get_overview_data, get_account_detail
from app.services.dashboard.mt5 import create_token_mt5,create_account_mt5,delete_account_mt5
from app.schema.mt5 import mt5_data,mt5_account
from app.services.dashboard.bot import create_bot_service,get_bot_service,update_bot_status,delete_bot_service
from app.schema.bot import BotCreate

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


# Dashboard Overview (all account)
@router.get("/overview")
def read_dashboard_overview(current_user = Depends(get_current_user)):
    return get_overview_data(current_user.id)

# MT5 (display on dashboard)
@router.get("/mt5/account/{account_id}")
def read_account_detail(account_id: str, current_user = Depends(get_current_user)):
    data = get_account_detail(current_user.id, account_id)
    if not data:
        raise HTTPException(status_code=404, detail="Account not found")
    return data

@router.post("/mt5/create-token")
def create_token(token_mt5:mt5_data, current_user = Depends(get_current_user)):
    print(token_mt5)
    data = create_token_mt5(token_mt5)
    if not data:
        raise HTTPException(status_code=404, detail="Token not found")
    return data

@router.post("/mt5/create-account")
def create_account(mt5_account:mt5_account, current_user = Depends(get_current_user)):
    data = create_account_mt5(mt5_account,current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Account not found")
    return data

@router.delete("/mt5/delete-account/{mt5_id}")
def delete_account(mt5_id:str,current_user=Depends(get_current_user)):
    data = delete_account_mt5(mt5_id)
    if not data:
        raise HTTPException(status_code=404, detail="Account not found")
    return data

# Bots (display on dashboard per account)
@limiter.limit("20/minute")
@router.post("/bots/{bot_id}/{connection}")
def update_bot(request: Request, bot_id: str, connection: str, current_user = Depends(get_current_user)):
    data = update_bot_status(bot_id, connection)
    if not data:
        raise HTTPException(status_code=404, detail="Bot status not found")
    return data

@router.get("/bots/get-bot")
def get_bot(current_user = Depends(get_current_user)):
    data = get_bot_service(current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Bot not found")
    return data

@router.post("/bots/create-bot")
def create_bot(bot_data: BotCreate, current_user = Depends(get_current_user)):
    data = create_bot_service(bot_data, current_user.id)
    if not data:
        raise HTTPException(status_code=500, detail="Failed to create bot")
    return data

@router.delete("/bots/delete-bot/{bot_id}")
def delete_bot(bot_id:str,current_user=Depends(get_current_user)):
    data = delete_bot_service(bot_id)
    if not data:
        raise HTTPException(status_code=404, detail="Bot not found")
    return data
