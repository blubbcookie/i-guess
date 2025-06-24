import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CloudUpload, FileText, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PythonFile } from "@shared/schema";

interface FileSidebarProps {
  selectedFile: PythonFile | null;
  onFileSelect: (file: PythonFile) => void;
  onShowUpload: () => void;
}

export function FileSidebar({ selectedFile, onFileSelect, onShowUpload }: FileSidebarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery<PythonFile[]>({
    queryKey: ["/api/files"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete file.",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const handleDelete = (e: React.MouseEvent, fileId: number) => {
    e.stopPropagation();
    deleteMutation.mutate(fileId);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold text-secondary mb-3">Files</h2>
        
        {/* File Upload Dropzone */}
        <Card 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={onShowUpload}
        >
          <CloudUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Drag & drop Python files here</p>
          <p className="text-xs text-gray-500 mt-1">or click to browse</p>
        </Card>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg" />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No Python files uploaded</p>
            <p className="text-xs mt-1">Upload a .py file to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <Card
                key={file.id}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedFile?.id === file.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onFileSelect(file)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-secondary truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileSelect(file);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      onClick={(e) => handleDelete(e, file.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <p>{files.length} files uploaded</p>
          <p>Total size: {formatFileSize(getTotalSize())}</p>
          <p>Max file size: 10 MB</p>
        </div>
      </div>
    </div>
  );
}
