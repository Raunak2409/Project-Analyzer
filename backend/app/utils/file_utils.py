import os
from app.services.classifier import classify_file

IGNORE_DIRS = {'.git', 'node_modules', 'dist', 'build', 'coverage', '__pycache__'}

def build_file_tree(directory_path: str, base_path: str = None, root_name: str = None):
    """
    Recursively builds a tree structure of the directory.
    Format: { "name": str, "type": "file" | "directory", "path": str, "children": [] }
    """
    if base_path is None:
        base_path = directory_path
        
    if root_name and directory_path == base_path:
        name = root_name
    else:
        name = os.path.basename(directory_path)
        if not name:
            name = os.path.basename(os.path.dirname(directory_path))
        
    rel_path = os.path.relpath(directory_path, base_path).replace(os.sep, '/')
    if rel_path == ".":
        rel_path = name

    node = {
        "name": name,
        "path": rel_path,
        "type": "directory" if os.path.isdir(directory_path) else "file"
    }

    if node["type"] == "directory":
        node["children"] = []
        try:
            items = os.listdir(directory_path)
            for item in items:
                if item in IGNORE_DIRS:
                    continue
                
                item_path = os.path.join(directory_path, item)
                node["children"].append(build_file_tree(item_path, base_path))
        except PermissionError:
            pass
    else:
        # Include classification for files
        node["categories"] = classify_file(rel_path)
            
    return node

def get_repo_metrics(directory_path: str):
    """
    Calculates basic metrics and classification summary for the repository.
    """
    file_count = 0
    total_lines = 0
    languages = {}
    classification = {}

    for root, dirs, files in os.walk(directory_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
        for file in files:
            file_count += 1
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, directory_path).replace(os.sep, '/')
            ext = os.path.splitext(file)[1].lower() or "unknown"
            
            languages[ext] = languages.get(ext, 0) + 1
            
            # Classification
            categories = classify_file(rel_path)
            for cat in categories:
                classification[cat] = classification.get(cat, 0) + 1
            
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    total_lines += sum(1 for _ in f)
            except Exception:
                pass

    return {
        "file_count": file_count,
        "total_lines": total_lines,
        "languages": languages,
        "classification": classification
    }
