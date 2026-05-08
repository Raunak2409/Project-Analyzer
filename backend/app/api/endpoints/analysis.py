from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from pydantic import BaseModel
from app.services.repo_processor import process_github_repo, process_zip_file, get_job_result
from app.services.ai_service import get_deep_file_explanation
import uuid
import shutil
import os

router = APIRouter()

class RepoUrl(BaseModel):
    url: str

@router.post("/clone")
async def clone_repo(repo: RepoUrl, background_tasks: BackgroundTasks):
    if not repo.url.startswith("https://github.com/"):
        raise HTTPException(status_code=400, detail="Invalid GitHub URL")
        
    job_id = str(uuid.uuid4())
    background_tasks.add_task(process_github_repo, repo.url, job_id)
    return {"job_id": job_id, "message": "Cloning and analysis started in background"}

@router.post("/upload")
async def upload_zip(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only ZIP files are allowed")
        
    job_id = str(uuid.uuid4())
    temp_dir = os.path.join(os.getcwd(), "temp_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    
    file_path = os.path.join(temp_dir, f"{job_id}.zip")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    background_tasks.add_task(process_zip_file, file_path, job_id, file.filename)
    return {"job_id": job_id, "message": "Upload successful, analysis started"}

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    result = get_job_result(job_id)
    if result["status"] == "not_found":
        raise HTTPException(status_code=404, detail="Job not found")
    return result

@router.get("/explain/{job_id}")
async def explain_file(job_id: str, file_path: str):
    job = get_job_result(job_id)
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Analysis not complete")
    
    explanation = await get_deep_file_explanation(file_path, job["data"]["tree"])
    return explanation
