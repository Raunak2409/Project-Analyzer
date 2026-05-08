import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the API key
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "your_gemini_api_key_here":
    genai.configure(api_key=api_key)

async def analyze_project_structure(tree_data: dict, metrics: dict):
    """
    Uses Gemini to provide architectural insights based on the file tree and metrics.
    """
    if not api_key or api_key == "your_gemini_api_key_here":
        return {
            "error": "Gemini API key not configured.",
            "technologies": [],
            "architecture_summary": "AI Analysis Unavailable",
            "folder_purposes": [],
            "file_descriptions": [],
            "module_relationships": [],
            "scalability_score": 0,
            "recommendations": []
        }

    # Use gemini-3-flash-preview based on available models
    model_name = 'gemini-3-flash-preview'
    
    try:
        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config={"response_mime_type": "application/json"}
        )
        
        prompt = f"""
        You are a senior software architect. Analyze the following project structure and metrics.
        
        FILE TREE:
        {json.dumps(tree_data, indent=2)}
        
        METRICS:
        {json.dumps(metrics, indent=2)}
        
        Provide your analysis in the following JSON format:
        {{
            "technologies": ["list of detected technologies"],
            "architecture_summary": "concise overview of the architectural pattern",
            "folder_purposes": [
                {{ "folder": "folder_name", "purpose": "what this folder contains and its role" }}
            ],
            "file_descriptions": [
                {{ 
                    "file": "important_file_name", 
                    "description": "what this file is",
                    "significance": "why this file is critical to the project",
                    "functionality": "detailed explanation of what this file actually does"
                }}
            ],
            "module_relationships": [
                {{ "from": "module_a", "to": "module_b", "relationship": "how they interact" }}
            ],
            "scalability_score": 1,
            "recommendations": ["potential improvements"]
        }}
        
        IMPORTANT: 
        1. For 'file_descriptions', provide deep technical context. 
        2. NEVER mention your identity, Gemini, or being an AI in any part of the response. 
        3. Act as if you are a human architect writing a professional report.
        """

        response = await model.generate_content_async(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {"error": str(e)}

async def get_deep_file_explanation(file_path: str, context_tree: dict):
    """
    Provides an in-depth explanation of a specific file.
    """
    model = genai.GenerativeModel('gemini-3-flash-preview')
    
    prompt = f"""
    As a senior software architect, provide an EXTREMELY in-depth technical explanation of the following file.
    
    FILE: {file_path}
    
    PROJECT CONTEXT:
    {json.dumps(context_tree, indent=2)[:5000]}
    
    Your goal is to explain exactly how this file works, its implementation logic, and its architectural significance.
    
    FORMAT: 
    You MUST return a JSON object with this EXACT structure:
    {{
        "title": "Clear File Name",
        "sections": [
            {{ 
                "heading": "Logic & Implementation", 
                "content": "Deep technical breakdown using markdown. Explain functions, classes, and logic flow." 
            }},
            {{ 
                "heading": "Architectural Significance", 
                "content": "Why this file exists and what happens if it is removed. Use markdown." 
            }},
            {{ 
                "heading": "Data Flow & Integration", 
                "content": "How this file interacts with other modules in the tree. Use markdown." 
            }}
        ]
    }}
    
    STRICT RULES:
    1. Provide at least 3 detailed sections.
    2. Use markdown (bold, lists, code blocks) inside the "content" strings.
    3. NEVER mention Gemini, Google, AI, or being a large language model.
    4. Stay purely technical and objective.
    """
    
    try:
        response = await model.generate_content_async(prompt)
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        return json.loads(text)
    except Exception as e:
        return {"error": str(e)}
