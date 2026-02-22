from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from app.core.database import get_supabase_client

http_bearer = HTTPBearer()

def get_current_user(credential: HTTPAuthorizationCredentials = Depends(http_bearer)):
    token = credential.credentials
    
    try:
        supabase = get_supabase_client()
        user = supabase.auth.get_user(token)
        
        if not user or not user.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"}
        )

        status_banned = supabase.table("profile").select("account_status").eq("user_id",user.user.id).single().execute()
        if status_banned and status_banned.data.get("account_status") == "banned":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="You are banned from accessing this service",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return user.user
    
    except HTTPException: # auth error
        raise
    
    except Exception as e: # code error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )
    

def get_current_admin(current_user = Depends(get_current_user)):
    user_id = current_user.id
    
    try:
        supabase = get_supabase_client()
        
        response = supabase.table("profile").select("role").eq("user_id",user_id).single().execute()
        user_data = response.data
        
        if user_data["role"] != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Not authorized to access this admin dashboard",
                headers={"WWW-Authenticate": "Bearer"}
            )
            
        return {"user_id": user_id, "role": user_data.get("role"), "email": user_data.get("email")}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )