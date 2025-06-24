import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, Clock, Upload, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PythonFile } from "@shared/schema";

interface ProgramSelectorProps {
  programs: PythonFile[];
  isLoading: boolean;
  onProgramSelect: (program: PythonFile) => void;
  onShowUpload: () => void;
}

export function ProgramSelector({ programs, isLoading, onProgramSelect, onShowUpload }: ProgramSelectorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      toast({
        title: "Program deleted",
        description: "The program has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete program.",
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

  const getFileDescription = (content: string) => {
    const lines = content.split('\n');
    const firstComment = lines.find(line => line.trim().startsWith('#') && line.trim().length > 1);
    if (firstComment) {
      return firstComment.replace('#', '').trim();
    }
    return "Python program";
  };

  const handleDelete = (e: React.MouseEvent, programId: number) => {
    e.stopPropagation();
    deleteMutation.mutate(programId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Programs Available</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Upload your first Python program to get started. You can upload multiple programs and choose which one to run.
        </p>
        <Button 
          onClick={onShowUpload}
          className="bg-blue-600 text-white hover:bg-blue-700"
          size="lg"
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload Your First Program
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <Card 
          key={program.id} 
          className="hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-blue-300 bg-white"
          onClick={() => onProgramSelect(program)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                  {program.name.replace('.py', '')}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                onClick={(e) => handleDelete(e, program.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {getFileDescription(program.content)}
            </p>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{formatFileSize(program.size)}</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(program.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Python
              </Badge>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:bg-green-700"
              onClick={(e) => {
                e.stopPropagation();
                onProgramSelect(program);
              }}
            >
              <Play className="mr-2 h-4 w-4" />
              Run Program
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}