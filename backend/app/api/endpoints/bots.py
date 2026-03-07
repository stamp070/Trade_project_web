from fastapi import APIRouter, Depends, HTTPException, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.security import get_current_user, verify_active_payment
from app.services.dashboard.bot import create_bot_service,get_bot_service,update_bot_status,delete_bot_service, disconnected_all_bots
from app.schema.bot import BotCreate

router = APIRouter()

limiter = Limiter(key_func=get_remote_address)

@limiter.limit("20/minute")
@router.post("/toggle-active/{bot_id}/{is_active}")
def update_bot(request: Request, bot_id: str, is_active: bool, current_user = Depends(verify_active_payment)):
    data = update_bot_status(bot_id, is_active)
    if not data:
        raise HTTPException(status_code=404, detail="Bot status not found")
    return data

@router.get("/get-bot")
def get_bot(current_user = Depends(get_current_user)):
    data = get_bot_service(current_user.id)
    if not data:
        raise HTTPException(status_code=404, detail="Bot not found")
    return data

@router.post("/create-bot")
def create_bot(bot_data: BotCreate, current_user = Depends(get_current_user)):
    data = create_bot_service(bot_data, current_user.id)
    if not data:
        raise HTTPException(status_code=500, detail="Failed to create bot")
    return data

@router.delete("/delete-bot/{bot_id}")
def delete_bot(bot_id:str,current_user=Depends(get_current_user)):
    data = delete_bot_service(bot_id)
    if not data:
        raise HTTPException(status_code=404, detail="Bot not found")
    return data
