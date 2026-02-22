from pydantic import BaseModel

class CheckoutRequest(BaseModel):
    invoice_ids: list[str]