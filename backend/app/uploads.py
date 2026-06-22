from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from app.dependencies.auth import get_current_user
from app.services.storage_service import storage_service
from app.utils.response import success_response

router = APIRouter()

@router.post("/thumbnail")
async def upload_thumbnail(
    file: UploadFile = File(..., description="Project thumbnail image (JPEG, PNG, WebP, GIF — max 5MB)"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a single project thumbnail.
    """
    try:
        # Validate file size here if needed (e.g., 5MB limit)
        result = await storage_service.upload_thumbnail(
            user_id=current_user["user_id"],
            file=file,
        )
        return success_response(data=result, message="Thumbnail uploaded successfully.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/screenshots")
async def upload_screenshots(
    files: List[UploadFile] = File(..., description="Screenshot images (up to 10, max 5MB each)"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload multiple project screenshots (max 10).
    """
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 screenshots allowed.")
        
    try:
        result = await storage_service.upload_screenshots(
            user_id=current_user["user_id"],
            files=files,
        )
        return success_response(
            data=result, 
            message=f"{result['count']} screenshot(s) uploaded successfully."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))