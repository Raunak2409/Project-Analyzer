"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { FileTree } from "./file-tree";
import { Maximize2, X } from "lucide-react";
import { Button } from "./ui/button";

interface TreeModalProps {
  tree: any;
}

const LEVEL_COLORS = [
  "text-indigo-600 dark:text-indigo-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-amber-600 dark:text-amber-400",
  "text-rose-600 dark:text-rose-400",
  "text-violet-600 dark:text-violet-400",
  "text-cyan-600 dark:text-cyan-400",
];

function ColoredFileTree({ node, level = 0 }: { node: any; level?: number }) {
  const color = LEVEL_COLORS[level % LEVEL_COLORS.length];
  const isDirectory = node.type === "directory";

  return (
    <div className="ml-4 border-l border-zinc-200 dark:border-zinc-800 pl-4 py-1">
      <div className="flex items-center gap-2 group">
        <span className={`text-sm font-medium ${color}`}>
          {isDirectory ? "📁" : "📄"} {node.name}
        </span>
        <span className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
          {node.path}
        </span>
      </div>
      {isDirectory && node.children && (
        <div className="mt-1">
          {node.children.map((child: any) => (
            <ColoredFileTree key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeModal({ tree }: TreeModalProps) {
  return (
    <Dialog>
      <DialogTrigger 
        render={
          <Button variant="outline" className="w-full mt-4 gap-2 border-dashed border-2 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300">
            <Maximize2 className="w-4 h-4" />
            View Full Tree Structure
          </Button>
        }
      />
      <DialogContent className="max-w-[90vw] w-[1000px] h-[85vh] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 flex flex-col p-0">
        <DialogHeader className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Maximize2 className="w-5 h-5" />
            </div>
            Project Structural Map
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <ColoredFileTree node={tree} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
