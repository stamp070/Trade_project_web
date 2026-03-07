from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import dashboard, payment, webhook, admin, mt5, ea
from app.Ai.model_loader import load_ai_model,unload_ai_model
from contextlib import asynccontextmanager
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware
from app.api.endpoints.dashboard import limiter
from apscheduler.schedulers.background import BackgroundScheduler
import threading

from app.Ai.main_predict import run_eurusd, run_llm_cronjob

@asynccontextmanager
async def lifespan(app: FastAPI):

    # 1. เปิดเซิร์ฟเวอร์ -> สั่งโหลดโมเดล
    load_ai_model()

    # 1.5 รัน LLM สดๆ รอบเดียวก่อนเพื่อให้มีข้อมูลใน Cache ทันทีที่เปิดใช้งาน
    threading.Thread(target=run_llm_cronjob).start()

    # run cronjob ทุก ชั่วโมง (เฉพาะ LLM)
    scheduler = BackgroundScheduler()
    scheduler.add_job(run_llm_cronjob, 'cron', minute=00)
    scheduler.start()
    yield

    # 2. ปิดเซิร์ฟเวอร์ -> สั่งเคลียร์โมเดล
    unload_ai_model()


app = FastAPI(title="Trade Project API", content_docs_url="/docs", redoc_url=None,lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.trycloudflare\.com",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])
app.include_router(payment.router, prefix="/api/payment", tags=["payment"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(mt5.router, prefix="/api/mt5", tags=["mt5"])
app.include_router(webhook.router, prefix="/api/stripe", tags=["webhook"])
app.include_router(ea.router, prefix="/api/ea", tags=["ea"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Trade Project API"}

@app.get("/predict")
def predict():
    return run_eurusd()

if __name__ == "__main__":
    import uvicorn
    from app.core.config import get_settings
    settings = get_settings()
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
