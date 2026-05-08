"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, File, Folder, Terminal, FileCode, ImageIcon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileNode[];
  categories?: string[];
}

interface FileTreeProps {
  node: FileNode;
  level?: number;
  onSelect: (node: FileNode) => void;
  selectedPath?: string;
}

export function FileTree({ node, level = 0, onSelect, selectedPath }: FileTreeProps) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const isDirectory = node.type === "directory";
  const isSelected = selectedPath === node.path;

  const getIcon = () => {
    if (isDirectory) return <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20" />;
    
    const ext = node.name.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "ts":
      case "tsx":
      case "js":
      case "jsx":
        return <FileCode className="w-4 h-4 text-indigo-500" />;
      case "json":
      case "yml":
      case "yaml":
      case "env":
        return <Settings className="w-4 h-4 text-zinc-500" />;
      case "png":
      case "jpg":
      case "svg":
      case "ico":
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      default:
        return <File className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-colors group",
          isSelected ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
          level === 0 && "font-semibold text-zinc-900 dark:text-zinc-50"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (isDirectory) setIsOpen(!isOpen);
          else onSelect(node);
        }}
      >
        {isDirectory ? (
          isOpen ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
        ) : (
          <div className="w-3.5" />
        )}
        {getIcon()}
        <span className="text-sm truncate">{node.name}</span>
        
        {node.categories && node.categories.length > 0 && node.categories[0] !== "other" && (
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            {node.categories[0]}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isDirectory && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <FileTree 
                key={child.path} 
                node={child} 
                level={level + 1} 
                onSelect={onSelect}
                selectedPath={selectedPath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
