import os
import shutil
import tempfile
import zipfile
from app.utils.file_utils import build_file_tree, get_repo_metrics
from app.services.ai_service import analyze_project_structure
from git import Repo

# Simple in-memory storage for analysis results
# In production, use Redis or a Database
analysis_results = {}

async def process_github_repo(repo_url: str, job_id: str):
    analysis_results[job_id] = {"status": "cloning", "progress": 10}
    
    with tempfile.TemporaryDirectory() as tmp_dir:
        try:
            print(f"[{job_id}] Cloning {repo_url}...")
            Repo.clone_from(repo_url, tmp_dir)
            
            analysis_results[job_id] = {"status": "analyzing", "progress": 50}
            
            # Extract repo name from URL
            repo_name = repo_url.rstrip("/").split("/")[-1]
            if repo_name.endswith(".git"):
                repo_name = repo_name[:-4]
                
            tree = build_file_tree(tmp_dir, root_name=repo_name)
            metrics = get_repo_metrics(tmp_dir)
            
            analysis_results[job_id] = {"status": "ai_analysis", "progress": 80}
            ai_insights = await analyze_project_structure(tree, metrics)
            
            analysis_results[job_id] = {
                "status": "completed",
                "progress": 100,
                "data": {
                    "tree": tree,
                    "metrics": metrics,
                    "ai_insights": ai_insights,
                    "repo_url": repo_url
                }
            }
            print(f"[{job_id}] Analysis complete.")
        except Exception as e:
            print(f"[{job_id}] Error: {e}")
            analysis_results[job_id] = {"status": "failed", "error": str(e)}

async def process_zip_file(zip_path: str, job_id: str, original_filename: str = None):
    analysis_results[job_id] = {"status": "extracting", "progress": 10}
    
    with tempfile.TemporaryDirectory() as tmp_dir:
        try:
            print(f"[{job_id}] Extracting ZIP: {zip_path}")
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(tmp_dir)
            
            analysis_results[job_id] = {"status": "analyzing", "progress": 50}
            
            # Extract zip name
            zip_name = original_filename if original_filename else os.path.basename(zip_path)
            if zip_name.endswith(".zip"):
                zip_name = zip_name[:-4]

            tree = build_file_tree(tmp_dir, root_name=zip_name)
            metrics = get_repo_metrics(tmp_dir)
            
            analysis_results[job_id] = {"status": "ai_analysis", "progress": 80}
            ai_insights = await analyze_project_structure(tree, metrics)
            
            analysis_results[job_id] = {
                "status": "completed",
                "progress": 100,
                "data": {
                    "tree": tree,
                    "metrics": metrics,
                    "ai_insights": ai_insights
                }
            }
            print(f"[{job_id}] ZIP Analysis complete.")
        except Exception as e:
            print(f"[{job_id}] ZIP Error: {e}")
            analysis_results[job_id] = {"status": "failed", "error": str(e)}
        finally:
            if os.path.exists(zip_path):
                os.remove(zip_path)

def get_job_result(job_id: str):
    return analysis_results.get(job_id, {"status": "not_found"})
