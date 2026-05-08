import os

CATEGORIES = {
    "frontend": {
        "extensions": {".tsx", ".jsx", ".html", ".svelte", ".vue"},
        "folders": {"frontend", "client", "ui", "pages", "web", "view", "views"},
    },
    "backend": {
        "extensions": {".py", ".go", ".java", ".cpp", ".rs", ".php", ".rb"},
        "folders": {"backend", "server", "app", "api", "core"},
    },
    "configuration": {
        "extensions": {".json", ".yaml", ".yml", ".toml", ".env", ".conf", ".ini", ".xml"},
        "filenames": {"package.json", "tsconfig.json", "next.config.js", "tailwind.config.js", "dockerfile", "docker-compose.yml"},
    },
    "database": {
        "extensions": {".sql", ".prisma", ".db", ".sqlite", ".graphql", ".gql"},
        "folders": {"db", "database", "migrations", "models", "schema"},
    },
    "assets": {
        "extensions": {".png", ".jpg", ".jpeg", ".svg", ".ico", ".css", ".scss", ".less", ".woff", ".woff2", ".ttf"},
        "folders": {"assets", "public", "static", "images", "img", "fonts", "styles", "css"},
    },
    "utilities": {
        "folders": {"utils", "helpers", "lib", "common", "utils", "hooks"},
    },
    "components": {
        "folders": {"components", "shared", "widgets", "elements", "layout", "layouts"},
    },
    "services": {
        "folders": {"services", "logic", "actions", "store", "providers", "context", "repository", "repositories"},
    },
    "api_routes": {
        "folders": {"routes", "api", "endpoints", "controllers", "handlers"},
    }
}

def classify_file(file_path: str):
    """
    Classifies a file based on its extension, filename, and path components.
    """
    # Normalize path to handle cross-platform separators
    normalized_path = file_path.replace('\\', '/')
    filename = os.path.basename(normalized_path).lower()
    ext = os.path.splitext(filename)[1].lower()
    path_parts = set(normalized_path.lower().split('/'))

    detected_categories = []

    for category, rules in CATEGORIES.items():
        # Check extensions
        if "extensions" in rules and ext in rules["extensions"]:
            detected_categories.append(category)
            continue
        
        # Check specific filenames
        if "filenames" in rules and filename in rules["filenames"]:
            detected_categories.append(category)
            continue
            
        # Check folder structure (path parts)
        if "folders" in rules and any(folder in path_parts for folder in rules["folders"]):
            detected_categories.append(category)
            continue

    return detected_categories if detected_categories else ["other"]
