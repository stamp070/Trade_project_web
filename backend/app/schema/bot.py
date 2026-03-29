from pydantic import BaseModel

class BotCreate(BaseModel):
    version_id: str
    mt5_id: str
    currency: str
