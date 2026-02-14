from fastapi import APIRouter, Depends, HTTPException
from app.schema.payment import CheckoutRequest
from app.services.payment.payment_service import create_checkout_session_service, get_invoice_data
from app.core.security import get_current_user

router = APIRouter()

@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest, user = Depends(get_current_user)):
    try:
        print("request", request)
        return await create_checkout_session_service(request.invoice_id, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-invoice/{user_id}")
def get_invoice(user_id:str, current_user = Depends(get_current_user)):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this invoice data")
    try:
        return get_invoice_data(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))