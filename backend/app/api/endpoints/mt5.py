from app.services.mt5.mt5_status import update_mt5_status
from app.services.mt5.mt5_authentication import authentication
from fastapi import APIRouter, HTTPException
from app.schema.mt5 import mt5_new_bars, TradeSignalRequest
from app.services.trade.signal import process_trade_signal, sync_transactions

router = APIRouter()

@router.post("/trade-signal")
async def get_trade_signal(data: TradeSignalRequest):
    account = authentication(data.mt5_name, data.token)
    if not account:
        raise HTTPException(status_code=401, detail="Unauthorized Mt5 name & Token")
    update_mt5_status(data.mt5_name, data.token, data.balance)

    try:
        sync_transactions(account, data.transactions)
    except Exception as e:
        print(f"[trade-signal] sync_transactions error: {e}")
    try:
        result = process_trade_signal(data.symbol, data.position)
        result["action"] = data.action
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/get-status")
async def get_status(data: mt5_new_bars):
    account = authentication(data.mt5_name, data.token)
    if not account:
        raise HTTPException(status_code=401, detail="Unauthorized Mt5 name & Token")

    res = update_mt5_status(data.mt5_name, data.token, data.balance)
    if res["status"] == "success":
        return {"status": "success", "action": data.action}
    else:
        raise HTTPException(status_code=500, detail="Update status not found")