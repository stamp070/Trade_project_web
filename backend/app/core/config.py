from enum import STRICT
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str

    API_HOST: str = "[IP_ADDRESS]"
    API_PORT: int = 8000

    STRIPE_PUBLISHABLE_KEY: str
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
