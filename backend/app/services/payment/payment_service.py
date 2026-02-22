
import stripe
from app.core.config import get_settings
from app.core.database import get_supabase_client
from app.schema.payment import CheckoutRequest

settings = get_settings()
stripe.api_key = settings.STRIPE_SECRET_KEY
YOUR_DOMAIN = "http://localhost:3000"

def get_invoice_data(user_id:str):
    supabase = get_supabase_client()
    invoice = supabase.table("invoice").select("*").eq("user_id", user_id).order("due_date",desc=False).execute()
    return invoice.data

async def create_checkout_session_service(request: list[str], user):
    supabase = get_supabase_client()
    
    # Fetch Invoices
    try:
        invoice_response = supabase.table("invoice").select("*").in_("invoice_id", request).execute()
        invoice_data = invoice_response.data
    except Exception as e:
        raise Exception("Invoices not found", e)

    profile = supabase.table("profile").select("*").eq("user_id", user.id).execute()
    customer_id = profile.data[0].get('stripe_customer_id') if profile.data else None

    if not customer_id:
        new_customer = stripe.Customer.create(
            email=user.email,
            metadata={"user_id": user.id}
        )
        customer_id = new_customer.id
        supabase.table("profile").update({"stripe_customer_id": customer_id}).eq("user_id", user.id).execute()

    stripe_items = []
    for item in invoice_data:
        amount = item.get("commission_amount", 0)
        if amount > 0:
            stripe_items.append({
                'price_data': {
                    'currency': 'thb',
                    'product_data': {
                        'name': f'Trading Fee (Invoice: {item["invoice_id"]})',
                    },
                    'unit_amount': int(amount * 100),
                },
                'quantity': 1,
            })

    try:
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            line_items=stripe_items,
            mode='payment', # Dynamic price usually uses 'payment' mode, unless creating a subscription product on the fly
            success_url=YOUR_DOMAIN + '/bills?payment=success',
            cancel_url=YOUR_DOMAIN + '/bills?payment=cancelled',
            metadata={"user_id": user.id, "invoice_ids": ",".join(request)}
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise Exception("Checkout session failed", e)
