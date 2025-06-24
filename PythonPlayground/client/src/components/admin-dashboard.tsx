import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ProgramSelector } from "@/components/program-selector";
import { ProgramRunner } from "@/components/program-runner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Upload, Users, Settings, Download } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { useToast } from "@/hooks/use-toast";
import type { PythonFile } from "@shared/schema";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [selectedProgram, setSelectedProgram] = useState<PythonFile | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showRunner, setShowRunner] = useState(false);
  const { toast } = useToast();

  const { data: programs = [], isLoading } = useQuery<PythonFile[]>({
    queryKey: ["/api/files"],
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/download-project", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to download project");
      }
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pylauncher-project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Download started",
        description: "The project files are being downloaded as a zip file.",
      });
    },
    onError: () => {
      toast({
        title: "Download failed",
        description: "Failed to download project files.",
        variant: "destructive",
      });
    },
  });

  const handleProgramSelect = (program: PythonFile) => {
    setSelectedProgram(program);
    setShowRunner(true);
  };

  const handleBackToSelection = () => {
    setShowRunner(false);
    setSelectedProgram(null);
  };

  const handleFileUploaded = (file: PythonFile) => {
    setShowUpload(false);
    setSelectedProgram(file);
    setShowRunner(true);
  };

  if (showRunner && selectedProgram) {
    return (
      <ProgramRunner 
        program={selectedProgram}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Code className="text-blue-600 mr-3 h-10 w-10" />
              PyLauncher Admin
            </h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Administrator Panel
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{programs.length} programs</span>
            </div>
            <Button 
              onClick={() => downloadMutation.mutate()}
              disabled={downloadMutation.isPending}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloadMutation.isPending ? "Downloading..." : "Download Project"}
            </Button>
            <Button 
              onClick={() => setShowUpload(true)} 
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Program
            </Button>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="border-gray-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Program Management
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload, manage, and test Python programs. Users can execute these programs through the terminal interface.
          </p>
        </div>

        <ProgramSelector 
          programs={programs}
          isLoading={isLoading}
          onProgramSelect={handleProgramSelect}
          onShowUpload={() => setShowUpload(true)}
        />
      </main>

      <FileUpload 
        open={showUpload}
        onOpenChange={setShowUpload}
        onFileSelect={handleFileUploaded}
      />
    </div>
  );
}