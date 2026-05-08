# Project Analyzer

An AI-powered tool that analyzes any code repository and generates a comprehensive architectural review. Paste a GitHub URL or upload a ZIP, and get instant insights into your project's structure, complexity, tech stack, module relationships, and more.

## ✨ Features

- **GitHub URL Analysis** — Paste any public GitHub repo URL to clone and analyze it automatically.
- **ZIP Upload Support** — Upload a local repository as a `.zip` file for offline analysis.
- **File Tree Explorer** — Browse the full directory structure of the analyzed project.
- **AI Architectural Review** — Powered by **Gemini 2.5 Flash**, generates a detailed report covering tech stack, architecture patterns, folder purposes, and module relationships.
- **Deep Dive Explanations** — Click any file in the tree to get an in-depth AI-generated breakdown of its logic, significance, and data flow.
- **Complexity & Scalability Score** — Instant metrics including file count, lines of code, language breakdown, and a 1–10 scalability score.
- **Dark / Light Mode** — Theme toggle built in.
- **Source Link Integration** — Direct link back to the original GitHub repository from the dashboard.

## 🏗️ Architecture

This is a **monorepo** with two independently runnable services:

```
project-analyzer/
├── backend/          ← Python FastAPI server (port 8000)
│   ├── app/
│   │   ├── main.py                    # FastAPI app entry point + CORS
│   │   ├── api/
│   │   │   ├── router.py              # Mounts all endpoint routers
│   │   │   └── endpoints/
│   │   │       └── analysis.py        # /clone, /upload, /status/{id}, /explain/{id}
│   │   ├── services/
│   │   │   ├── repo_processor.py      # GitHub clone & ZIP extract → async background jobs
│   │   │   ├── ai_service.py          # Gemini API integration (architecture + deep-dive)
│   │   │   └── classifier.py          # File categorization by extension & path
│   │   └── utils/
│   │       └── file_utils.py          # Recursive file tree builder + metrics engine
│   ├── requirements.txt
│   └── .env                           # GEMINI_API_KEY goes here
└── frontend/         ← Next.js 16 app (port 3000)
    └── src/
        ├── app/
        │   ├── layout.tsx             # Root layout with ThemeProvider
        │   ├── page.tsx               # Landing page with AnalyzerForm
        │   └── dashboard/             # Results dashboard page
        └── components/
            ├── analyzer-form.tsx      # GitHub URL / ZIP upload form
            ├── architecture-panel.tsx # AI review display component
            ├── file-tree.tsx          # Interactive file tree sidebar
            ├── deep-dive-modal.tsx    # Per-file AI explanation modal
            └── theme-toggle.tsx       # Dark/light mode switcher
```

## 💻 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **Git** installed and in your system PATH
- A **Google Gemini API Key** — get one free at [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/project-analyzer.git
cd project-analyzer
```

---

### 2. Backend Setup

```bash
cd backend

# (Optional but recommended) create a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
DEBUG=True
HOST=0.0.0.0
PORT=8000
```

Start the backend server:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at `http://localhost:8000`.

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

The app will be live at `http://localhost:3000`.

---

### 4. Usage

1. Open [http://localhost:3000](http://localhost:3000).
2. Paste a **public** GitHub URL (e.g. `https://github.com/user/repo`) — or switch to the **ZIP Upload** tab and upload a `.zip` of your project.
3. Click **Start Analysis** and wait for the background job to complete.
4. Explore the file tree, read the AI-generated architectural review, and click any file for a deep-dive explanation.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| **UI Components** | Shadcn UI, Framer Motion, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn |
| **Repo Cloning** | GitPython |
| **AI / ML** | Google Gemini (`gemini-2.5-flash`) via `google-generativeai` |
| **Background Jobs** | FastAPI `BackgroundTasks` (in-memory, UUID-tracked) |

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analysis/clone` | Start analysis from a GitHub URL |
| `POST` | `/api/analysis/upload` | Start analysis from a ZIP file upload |
| `GET` | `/api/analysis/status/{job_id}` | Poll job status and retrieve results |
| `GET` | `/api/analysis/explain/{job_id}?file_path=...` | Get AI deep-dive for a specific file |

## ⚠️ Important Notes

> **API Keys** — Never commit real API keys. The `backend/.env` file is listed in `.gitignore`. Each collaborator must create their own `.env` with their own Gemini key.

> **`google-generativeai` deprecation** — The backend currently uses the `google-generativeai` package which is deprecated in favour of `google-genai`. It still works but a migration is planned.

> **In-memory job storage** — Analysis results are stored in a Python dictionary for the lifetime of the server process. Restarting the backend clears all jobs. For production, use Redis or a database.

> **Public repos only** — The `/clone` endpoint only accepts `https://github.com/` URLs and will clone them without authentication. Private repos are not supported.

## 🚀 Deployment

- **Frontend** — Deploy to [Vercel](https://vercel.com/) (zero config for Next.js). Set `NEXT_PUBLIC_API_URL` to your backend's deployed URL.
- **Backend** — Deploy to [Railway](https://railway.app/), [Render](https://render.com/), or any platform that supports Python. Set `GEMINI_API_KEY` as an environment variable.

## 📜 License

This project is licensed under the **MIT License**.
