"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Sparkles, Loader2, BookOpen, ChevronRight, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface DeepDiveModalProps {
  jobId: string;
  file: any;
}

export function DeepDiveModal({ jobId, file }: DeepDiveModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const fetchExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/analysis/explain/${jobId}?file_path=${encodeURIComponent(file.path)}`);
      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the analysis service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o);
      if (o && !data) fetchExplanation();
    }}>
      <DialogTrigger 
        render={
          <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-500/20 py-6 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99]">
            <Sparkles className="w-5 h-5 animate-pulse" />
            Deep Dive Explanation
          </Button>
        }
      />
      <DialogContent className="max-w-[95vw] sm:max-w-[800px] h-[85vh] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-white/20 dark:border-white/10 flex flex-col p-0 shadow-2xl overflow-hidden rounded-2xl">
        <DialogHeader className="p-8 border-b border-white/10 dark:border-white/5 bg-white/20 dark:bg-zinc-800/20">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
              Technical Deep Dive: {file.name}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 animate-pulse" />
                <Loader2 className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Architecting Insights...</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Analyzing logic patterns and implementation details.</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="p-3 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-red-900 dark:text-red-400">Generation Failed</h4>
              <p className="text-sm text-zinc-500 max-w-xs">{error}</p>
              <Button variant="outline" onClick={fetchExplanation} className="mt-4">
                Retry Analysis
              </Button>
            </div>
          ) : data ? (
            <div className="space-y-10 pb-12">
              {data.sections?.map((section: any, i: number) => (
                <div key={i} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <h3 className="text-xl font-black flex items-center gap-2 text-indigo-600 dark:text-indigo-400 tracking-tight">
                    <ChevronRight className="w-5 h-5 opacity-50" />
                    {section.heading}
                  </h3>
                  <div className="prose prose-zinc dark:prose-invert max-w-none 
                    prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-relaxed
                    prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400
                    prose-code:bg-indigo-50 dark:prose-code:bg-indigo-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-indigo-600 dark:prose-code:text-indigo-300
                    prose-pre:bg-zinc-950 dark:prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10">
                    <ReactMarkdown>{section.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-zinc-500 p-12">Select a file to begin the deep dive analysis.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
