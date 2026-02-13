from pydantic import BaseModel

class CheckoutRequest(BaseModel):
    invoice_id: str