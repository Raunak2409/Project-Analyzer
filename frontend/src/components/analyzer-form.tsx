"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Upload, Loader2 } from "lucide-react";

export function AnalyzerForm() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleGithubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/analysis/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl }),
      });
      const data = await response.json();
      if (response.ok) {
        router.push(`/dashboard?jobId=${data.job_id}`);
      } else {
        alert(data.detail || "Failed to start analysis");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_URL}/api/analysis/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        router.push(`/dashboard?jobId=${data.job_id}`);
      } else {
        alert(data.detail || "Failed to upload file");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-zinc-200/50 backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 dark:border-zinc-800/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Analyze Project</CardTitle>
        <CardDescription>
          Choose a GitHub repository or upload a ZIP file to begin the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="github" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" /> GitHub
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> ZIP Upload
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="github">
            <form onSubmit={handleGithubSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Repository URL
                </label>
                <Input
                  placeholder="https://github.com/username/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="h-12 border-zinc-200 dark:border-zinc-800"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200"
                disabled={loading || !repoUrl}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Analysis"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-12 space-y-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors cursor-pointer group">
              <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                <Upload className="w-8 h-8 text-zinc-400 group-hover:text-indigo-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-zinc-500">ZIP files only (max. 50MB)</p>
              </div>
              <Input 
                type="file" 
                className="hidden" 
                id="zip-upload"
                accept=".zip" 
                onChange={handleFileUpload}
                disabled={loading}
              />
              <Button 
                variant="outline" 
                className="mt-4" 
                nativeButton={false}
                render={
                  <label htmlFor="zip-upload" className="cursor-pointer" />
                }
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Select File"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
