import os
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from app.database.supabase import supabase
from app.dependencies.auth import get_current_user  # see below
from fastapi import APIRouter, Request, HTTPException, Depends

router = APIRouter()

# 1. Initialize Firebase Admin
if not firebase_admin._apps:
    try:
        cred_path = os.path.join(os.getcwd(), "firebase-adminsdk.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print(f"Firebase Admin Initialized Successfully from: {cred_path}")
        else:
            print(f"CRITICAL: firebase-adminsdk.json not found at {cred_path}")
    except Exception as e:
        print(f"CRITICAL: Firebase Admin failed to initialize. Error: {e}")


@router.post("/verify-firebase")
async def verify_firebase_and_sync(request: Request):
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid token")

        token = auth_header.split(" ")[1]
        decoded_token = firebase_auth.verify_id_token(token)
        uid = decoded_token['uid']
        email = decoded_token.get('email', '')
        name = decoded_token.get('name', 'Developer')
        picture = decoded_token.get('picture', '')

        response = supabase.table("profiles").select("*").eq("id", uid).execute()

        if not response.data:
            new_profile = {
                "id": uid,
                "username": f"{email.split('@')[0]}_{uid[:4]}",
                "full_name": name,
                "avatar_url": picture
            }
            supabase.table("profiles").insert(new_profile).execute()
            return {"message": "New profile created", "user": new_profile}

        return {"message": "Existing profile verified", "user": response.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Backend Sync Error: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")


@router.get("/me")
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    uid = current_user["user_id"]
    response = supabase.table("profiles").select("*").eq("id", uid).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"data": response.data[0]}


@router.put("/me")
async def update_my_profile(request: Request, current_user: dict = Depends(get_current_user)):
    uid = current_user["user_id"]
    body = await request.json()

    allowed_fields = {"username", "full_name", "avatar_url"}
    update_data = {k: v for k, v in body.items() if k in allowed_fields}

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    response = supabase.table("profiles").update(update_data).eq("id", uid).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"data": response.data[0]}


@router.get("/profile/{username}")
async def get_public_profile(username: str):
    response = supabase.table("profiles").select("*").eq("username", username).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"data": response.data[0]}