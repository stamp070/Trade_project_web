
import stripe
from app.core.config import get_settings
from app.core.database import get_supabase_client

settings = get_settings()
stripe.api_key = settings.STRIPE_SECRET_KEY
YOUR_DOMAIN = "http://localhost:3000"

def get_invoice_data(user_id:str):
    supabase = get_supabase_client()
    invoice = supabase.table("invoice").select("*").eq("user_id", user_id).execute()
    print(invoice.data)
    return invoice.data

async def create_checkout_session_service(invoice_id: str, user):
    supabase = get_supabase_client()
    
    # Fetch Invoice
    invoice_response = supabase.table("invoice").select("*").eq("invoice_id", invoice_id).execute()
    if not invoice_response.data:
        raise Exception("Invoice not found")
    
    invoice = invoice_response.data[0]
    amount = invoice.get('commission_amount', 0)
    
    if not amount or amount <= 0:
         raise Exception("Invalid invoice amount")

    profile = supabase.table("profile").select("*").eq("user_id", user.id).execute()
    customer_id = profile.data[0].get('stripe_customer_id') if profile.data else None

    if not customer_id:
        new_customer = stripe.Customer.create(
            email=user.email,
            metadata={"user_id": user.id}
        )
        customer_id = new_customer.id
        supabase.table("profile").update({"stripe_customer_id": customer_id}).eq("user_id", user.id).execute()

    try:
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            line_items=[
                {
                    'price_data': {
                        'currency': 'thb',
                        'product_data': {
                            'name': f'Trading Fee (Invoice: {invoice_id[:8]})',
                        },
                        'unit_amount': int(amount * 100), # Satang
                    },
                    'quantity': 1,
                },
            ],
            mode='payment', # Dynamic price usually uses 'payment' mode, unless creating a subscription product on the fly
            success_url=YOUR_DOMAIN + '/dashboard?payment=success',
            cancel_url=YOUR_DOMAIN + '/dashboard?payment=cancelled',
            metadata={"user_id": user.id, "invoice_id": invoice_id}
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise e
