from pydantic import BaseModel
from typing import List, Optional

class mt5_data(BaseModel):
    mt5_name:str
    account_name:str
    
class mt5_account(mt5_data):
    token:str

class mt5_new_bars(BaseModel):
    mt5_name: str
    token: str
    balance: str
    symbol: Optional[str] = None
    action: Optional[str] = None
    

class TransactionItem(BaseModel):
    ticket_id: int
    tradetype: str                     
    lotsize: float
    profit_loss: float
    open_at: Optional[int] = None      
    close_at: Optional[int] = None     

class TradeSignalRequest(BaseModel):
    mt5_name: str
    token: str
    balance: float
    symbol: str
    action: str
    position: str
    transactions: List[TransactionItem] = []  
