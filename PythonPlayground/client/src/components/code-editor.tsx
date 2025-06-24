import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Save, Play, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PythonFile } from "@shared/schema";

interface CodeEditorProps {
  file: PythonFile | null;
  onFileUpdate: (file: PythonFile) => void;
  onExecute: () => void;
}

export function CodeEditor({ file, onFileUpdate, onExecute }: CodeEditorProps) {
  const [content, setContent] = useState("");
  const [isModified, setIsModified] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (file) {
      setContent(file.content);
      setIsModified(false);
    }
  }, [file]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!file || !file.id) {
        // Create new file
        const response = await apiRequest("POST", "/api/files", {
          name: file?.name || "untitled.py",
          content,
          size: new Blob([content]).size,
        });
        return response.json();
      } else {
        // Update existing file
        const response = await apiRequest("PUT", `/api/files/${file.id}`, {
          name: file.name,
          content,
          size: new Blob([content]).size,
        });
        return response.json();
      }
    },
    onSuccess: (savedFile) => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      onFileUpdate(savedFile);
      setIsModified(false);
      toast({
        title: "File saved",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save file.",
        variant: "destructive",
      });
    },
  });

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsModified(true);
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  const handleExecuteClick = () => {
    if (isModified && file?.id) {
      // Save before executing
      saveMutation.mutate();
    }
    onExecute();
  };

  const insertTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setContent(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
      setIsModified(true);
    }
  };

  if (!file) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No file selected</h3>
            <p className="text-sm">Select a file from the sidebar or create a new one to start coding</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium text-secondary">{file.name}</span>
              {isModified && (
                <div 
                  className="w-2 h-2 bg-orange-400 rounded-full" 
                  title="File has unsaved changes"
                />
              )}
            </div>
            <div className="flex space-x-2 text-xs text-gray-500">
              <span>Python 3.9</span>
              <span>•</span>
              <span>
                {file.updatedAt 
                  ? new Date(file.updatedAt).toLocaleString()
                  : "Not saved"
                }
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              disabled={!isModified || saveMutation.isPending}
            >
              <Save className="mr-1 h-3 w-3" />
              Save
            </Button>
            <Button 
              className="bg-accent text-white hover:bg-green-600"
              size="sm"
              onClick={handleExecuteClick}
            >
              <Play className="mr-2 h-3 w-3" />
              Run Code
            </Button>
          </div>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex-1 bg-code">
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={insertTab}
          className="w-full h-full p-4 text-white font-mono text-sm bg-code border-0 outline-0 resize-none"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            backgroundColor: "hsl(240, 10%, 3.9%)",
            color: "hsl(0, 0%, 98%)",
            lineHeight: "1.5",
          }}
          placeholder="# Write your Python code here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}
