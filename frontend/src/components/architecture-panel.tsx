"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Layers, AlertCircle, Info, Star, Activity, FileCode as FileIcon } from "lucide-react";
import { DeepDiveModal } from "./deep-dive-modal";

interface AIInsights {
  technologies: string[];
  architecture_summary: string;
  folder_purposes: { folder: string; purpose: string }[];
  file_descriptions: { 
    file: string; 
    description: string;
    significance?: string;
    functionality?: string;
  }[];
  module_relationships: { from: string; to: string; relationship: string }[];
  scalability_score: number;
  recommendations: string[];
  error?: string;
}

export function ArchitecturePanel({ 
  insights, 
  selectedFile,
  jobId
}: { 
  insights: AIInsights;
  selectedFile: any;
  jobId: string;
}) {
  const fileDetail = selectedFile 
    ? insights.file_descriptions.find(f => selectedFile.path.toLowerCase().includes(f.file.toLowerCase()))
    : null;

  if (insights.error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
        <CardContent className="pt-6 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-red-900 dark:text-red-400">Analysis Unavailable</p>
            <p className="text-sm text-red-700 dark:text-red-500/80">{insights.error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {selectedFile && (
        <Card className="border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-indigo-600 text-white">
                <FileIcon className="w-4 h-4" />
              </div>
              <CardTitle className="text-base truncate">{selectedFile.name}</CardTitle>
              <Badge variant="outline" className="ml-2 capitalize">
                {selectedFile.categories?.[0] || "file"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-3 h-3" /> Overview
                </h5>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {fileDetail?.description || "A functional module contributing to the project's core logic."}
                </p>
              </div>
              
              <div className="space-y-1">
                <h5 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Star className="w-3 h-3" /> Significance
                </h5>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {fileDetail?.significance || "Crucial for maintaining architectural integrity and system performance."}
                </p>
              </div>

              <div className="space-y-1">
                <h5 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3 h-3" /> Functionality
                </h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {fileDetail?.functionality || "Handles internal data flow and implements specific business requirements defined for this component."}
                </p>
              </div>
            </div>
            
            <DeepDiveModal jobId={jobId} file={selectedFile} />
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-zinc-200/50 dark:border-zinc-800/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Layers className="w-32 h-32" />
        </div>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Architectural Review</CardTitle>
              <CardDescription>Deep analysis of codebase patterns</CardDescription>
            </div>
            <div className="ml-auto px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Scalability</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{insights.scalability_score}/10</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              Summary
            </h4>
            <p className="text-lg font-medium leading-relaxed dark:text-zinc-200">
              {insights.architecture_summary}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {insights.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-none px-3 py-1 text-xs font-medium">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {insights.module_relationships.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                Key Relationships
              </h4>
              <div className="space-y-2">
                {insights.module_relationships.map((rel, i) => (
                  <div key={i} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 text-sm">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{rel.from}</span>
                    <span className="mx-2 text-zinc-400">→</span>
                    <span className="font-bold text-violet-600 dark:text-violet-400">{rel.to}</span>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400 text-xs">{rel.relationship}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Folder Purposes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {insights.folder_purposes.map((folder, i) => (
              <div key={i} className="flex gap-4 items-start p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="mt-1 p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
                  <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-zinc-200">{folder.folder}</p>
                  <p className="text-xs text-zinc-500 leading-normal">{folder.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
