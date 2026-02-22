from pydantic import BaseModel

class mt5_data(BaseModel):
    mt5_name:str
    account_name:str
    
class mt5_account(mt5_data):
    token:str

class mt5_new_bars(BaseModel):
    mt5_name: str
    token: str
    balance: str
    symbol: str
    action: str

