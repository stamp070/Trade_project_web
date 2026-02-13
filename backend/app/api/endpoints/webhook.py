
import stripe
from fastapi import APIRouter, Request, HTTPException, Header
from app.core.config import get_settings
from app.core.database import get_supabase_admin_client
from datetime import datetime

router = APIRouter()
settings = get_settings()

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    sig_header = stripe_signature
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET # ต้องเพิ่มใน .env

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Extract data
        # เราควรใส่ invoice_id ไว้ใน metadata ตอนสร้าง session (ต้องไปแก้ payment_service.py)
        # หรือถ้าไม่มี ก็ต้องหาจาก logic อื่น แต่ best practice คือใส่ invoice_id ใน metadata
        invoice_id = session.get("metadata", {}).get("invoice_id")
        payment_id = session.get("id")
        
        if invoice_id:
            supabase = get_supabase_admin_client() # Use Admin client to bypass RLS if needed
            
            # Update Invoice Status
            data = {
                "status": "paid",
                "payment_id": payment_id,
                "paid_at": datetime.now().isoformat()
            }
            
            response = supabase.table("invoice").update(data).eq("invoice_id", invoice_id).execute()
            print(f"Updated invoice {invoice_id}: {response.data}")

    return {"status": "success"}
