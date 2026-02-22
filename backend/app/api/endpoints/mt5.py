from app.services.mt5.mt5_status import update_mt5_status
from app.services.mt5.mt5_authentication import authentication
from fastapi import APIRouter, HTTPException
from app.schema.mt5 import mt5_new_bars
from pydantic import BaseModel


router = APIRouter()

@router.post("/get-status")
async def get_status(data: mt5_new_bars):
    mt5_name = data.mt5_name
    token = data.token
    balance = data.balance

    if not authentication(mt5_name, token):
        raise HTTPException(status_code=401, detail="Unauthorized Mt5 name & Token")

    res = update_mt5_status(mt5_name, token, balance)
    print(res)
    if res["status"] =="success":
        return {"status": "success"}
    else:
        raise HTTPException(status_code=500, detail="Update status not found")