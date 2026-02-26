import stripe
from fastapi import APIRouter, Request, HTTPException, Header
from app.core.config import get_settings
from app.core.database import get_supabase_admin_client,get_supabase_client
from datetime import datetime, timedelta, timezone

BKK_TZ = timezone(timedelta(hours=7))

router = APIRouter()
settings = get_settings()

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    print("using webhook stripe")
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
        
        invoice_ids = session.get("metadata", {}).get("invoice_ids").split(",")
        payment_id = session.get("id")
        print(invoice_ids)
        
        if invoice_ids:
            supabase = get_supabase_client() # Use Admin client to bypass RLS if needed
            
            # Update Invoice Status
            data = {
                "status": "paid",
                "payment_id": payment_id,
                "paid_at": datetime.now(BKK_TZ).isoformat()
            }
            
            response = supabase.table("invoice").update(data).in_("invoice_id", invoice_ids).execute()
            print(f"Updated invoice {invoice_ids}: {response.data}")

    return {"status": "success"}
