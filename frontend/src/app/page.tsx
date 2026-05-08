import { AnalyzerForm } from "@/components/analyzer-form";
import { Terminal, Code2, Zap, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />
      
      <header className="relative z-10 border-b border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md bg-white/50 dark:bg-zinc-950/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Project Analyzer</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">How it works</a>
            <a href="https://github.com" target="_blank" className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              <Terminal className="w-4 h-4" /> GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Understand your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">codebase</span> in seconds
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Get deep insights into your repository structure, complexity, and dependencies. Just paste a GitHub URL or upload a ZIP.
            </p>
          </div>

          <div className="mb-24">
            <AnalyzerForm />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Instant Analysis</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Get a complete breakdown of your project structure and metrics in real-time.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Visual Reports</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Understand your code through beautiful, interactive charts and visualizations.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">GitHub Integrated</h3>
              <p className="text-zinc-600 dark:text-zinc-400">Simply paste any public GitHub URL and we'll handle the rest automatically.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-12 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-zinc-500 text-sm">© 2024 Project Analyzer. Built for developers by developers.</p>
        </div>
      </footer>
    </div>
  );
}
