from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import dashboard

app = FastAPI(title="Trade Project API", content_docs_url="/docs", redoc_url=None)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard.router, prefix="/api/overview", tags=["overview"])
app.include_router(dashboard.router, prefix="/api/account", tags=["account"])   

@app.get("/")
def read_root():
    return {"message": "Welcome to Trade Project API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
