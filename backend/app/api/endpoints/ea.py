from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

FILE_PATH = "ea/expert.ex5"

@router.get("/get-ea")
async def download_ea():
    if not os.path.exists(FILE_PATH):
        return {"error": "File not found"}
    
    return FileResponse(
        path=FILE_PATH, 
        filename="expert.ex5",
        media_type="application/octet-stream"
    )