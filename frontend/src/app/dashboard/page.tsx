"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTree } from "@/components/file-tree";
import { ArchitecturePanel } from "@/components/architecture-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  BarChart3, FileCode, Hash, FolderTree, ArrowLeft, 
  Search, Loader2, RefreshCcw, AlertTriangle, Terminal,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

function DashboardContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!jobId) {
      setError("No analysis job ID provided.");
      setLoading(false);
      return;
    }

    const pollStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/analysis/status/${jobId}`);
        const result = await response.json();

        if (result.status === "completed") {
          setData(result.data);
          setLoading(false);
          return true;
        } else if (result.status === "failed") {
          setError(result.error || "Analysis failed.");
          setLoading(false);
          return true;
        }
        return false;
      } catch (err) {
        console.error("Polling error:", err);
        setError("Failed to connect to analysis service.");
        setLoading(false);
        return true;
      }
    };

    const interval = setInterval(async () => {
      const stop = await pollStatus();
      if (stop) clearInterval(interval);
    }, 2000);

    pollStatus();
    return () => clearInterval(interval);
  }, [jobId, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 space-y-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-indigo-100 dark:border-indigo-900 animate-pulse" />
          <Loader2 className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold dark:text-white mb-2">Analyzing Codebase...</h2>
          <p className="text-zinc-500 max-w-xs mx-auto">Scanning project architecture and implementation patterns.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Analysis Error</h2>
        <p className="text-zinc-500 mb-8">{error}</p>
        <Link href="/">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold">Try Again</button>
        </Link>
      </div>
    );
  }

  const { metrics, tree, ai_insights } = data;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <span>Project Analyzer</span>
                <span className="text-zinc-400 font-normal hidden sm:inline">/</span>
                <span className="text-zinc-500 font-medium text-sm truncate max-w-[150px] hidden sm:inline">{tree.name}</span>
              </h1>
              
              {data.repo_url && (
                <a 
                  href={data.repo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-full hover:border-red-500 dark:hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  <span className="tracking-tight">View Source</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-500 transition-colors" />
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search files..." 
                className="pl-10 h-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:ring-1 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ThemeToggle />
            <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="h-1 w-full bg-indigo-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-indigo-500" /> Total Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{metrics.file_count.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="h-1 w-full bg-violet-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-violet-500" /> Lines of Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{(metrics.total_lines / 1000).toFixed(1)}k</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden min-h-[140px]">
            <div className="h-1 w-full bg-emerald-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-500" /> Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const sortedLangs = Object.entries(metrics.languages).sort((a: any, b: any) => b[1] - a[1]);
                const mainLang = sortedLangs[0];
                const others = sortedLangs.slice(1);
                
                return (
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black capitalize">{mainLang?.[0] || "N/A"}</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">(Main Language)</span>
                    </div>
                    
                    <div className="max-h-[60px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {others.map(([lang, count]: any) => (
                          <div key={lang} className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                            <span className="capitalize">{lang}</span>
                            <span>{count} files</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="h-1 w-full bg-amber-500" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <FolderTree className="w-3.5 h-3.5 text-amber-500" /> Complexity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">
                {metrics.file_count > 100 ? "High" : metrics.file_count > 50 ? "Medium" : "Low"}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* File Explorer */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between ml-1">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">File Explorer</h3>
              {selectedFile && (
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="text-[10px] text-indigo-500 hover:underline"
                >
                  Clear Selection
                </button>
              )}
            </div>
            <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm overflow-hidden h-[calc(100vh-320px)] flex flex-col">
              <CardContent className="p-4 overflow-y-auto flex-1">
                <FileTree 
                  node={tree} 
                  onSelect={setSelectedFile} 
                  selectedPath={selectedFile?.path}
                />
              </CardContent>
            </Card>
          </div>

          {/* Architecture Insights */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest ml-1">Intelligence Report</h3>
            <ArchitecturePanel 
              insights={ai_insights} 
              selectedFile={selectedFile} 
              jobId={jobId as string}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Analyzer...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
