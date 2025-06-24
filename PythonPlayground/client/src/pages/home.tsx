import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProgramSelector } from "@/components/program-selector";
import { ProgramRunner } from "@/components/program-runner";
import { Button } from "@/components/ui/button";
import { Code, Upload, ArrowLeft } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import type { PythonFile } from "@shared/schema";

export default function Home() {
  const [selectedProgram, setSelectedProgram] = useState<PythonFile | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showRunner, setShowRunner] = useState(false);

  const { data: programs = [], isLoading } = useQuery<PythonFile[]>({
    queryKey: ["/api/files"],
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
    // Optionally auto-select the uploaded file
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
              PyLauncher
            </h1>
            <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full">
              Select and run your Python programs
            </span>
          </div>
          <Button 
            onClick={() => setShowUpload(true)} 
            className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Program
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose a Program to Run
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select from your uploaded Python programs below to execute them instantly
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
