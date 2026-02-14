from pydantic import BaseModel
from typing import Literal

class BotCreate(BaseModel):
    version_id: str
    mt5_id: str
    currency: Literal['EURUSD', 'JPYUSD', 'GBPUSD']
