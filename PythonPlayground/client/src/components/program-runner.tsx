import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Square, FileText, Clock, CheckCircle, XCircle, Terminal } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PythonFile, Execution } from "@shared/schema";

interface ProgramRunnerProps {
  program: PythonFile;
  onBack: () => void;
}

interface ExecutionResult {
  execution: Execution;
  output: string;
  error: string;
  executionTime: number;
  status: string;
}

export function ProgramRunner({ program, onBack }: ProgramRunnerProps) {
  const [autoRun, setAutoRun] = useState(false);
  const { toast } = useToast();

  const { data: executions = [] } = useQuery<Execution[]>({
    queryKey: ["/api/files", program.id, "executions"],
  });

  const executeMutation = useMutation({
    mutationFn: async (fileId: number): Promise<ExecutionResult> => {
      const response = await apiRequest("POST", `/api/execute/${fileId}`);
      return response.json();
    },
    onError: () => {
      toast({
        title: "Execution Error",
        description: "Failed to execute Python program.",
        variant: "destructive",
      });
    },
  });

  // Auto-run the program when component mounts if autoRun is enabled
  useEffect(() => {
    if (autoRun && program.id) {
      executeMutation.mutate(program.id);
    }
  }, [program.id, autoRun]);

  const latestExecution = executions[0];
  const result = executeMutation.data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    return `${(ms / 1000).toFixed(3)}s`;
  };

  const currentResult = result || (latestExecution && {
    execution: latestExecution,
    output: latestExecution.output || "",
    error: latestExecution.error || "",
    executionTime: latestExecution.executionTime || 0,
    status: latestExecution.status,
  });

  const handleRunProgram = () => {
    if (program.id) {
      executeMutation.mutate(program.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Button>
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{program.name}</h1>
                <p className="text-sm text-gray-500">Python Program Execution</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleRunProgram}
              disabled={executeMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="mr-2 h-4 w-4" />
              {executeMutation.isPending ? "Running..." : "Run Program"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Program Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Program Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">File Name</label>
                  <p className="text-sm text-gray-900 font-mono">{program.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">File Size</label>
                  <p className="text-sm text-gray-900">{Math.round(program.size / 1024 * 100) / 100} KB</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Modified</label>
                  <p className="text-sm text-gray-900">{new Date(program.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Code Preview</label>
                  <div className="mt-2 bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                      {program.content.slice(0, 500)}
                      {program.content.length > 500 && "\n... (truncated)"}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Terminal className="mr-2 h-5 w-5 text-green-600" />
                  Execution Results
                </div>
                {executeMutation.isPending && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span className="text-sm text-gray-600">Running...</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!currentResult && !executeMutation.isPending ? (
                <div className="text-center py-12">
                  <Play className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-4">Click "Run Program" to execute</p>
                  <Button 
                    onClick={handleRunProgram}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Run Program
                  </Button>
                </div>
              ) : executeMutation.isPending ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Executing Python program...</p>
                </div>
              ) : currentResult ? (
                <div className="space-y-4">
                  {/* Execution Info */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusIcon(currentResult.status)}
                          <span className={`font-medium ${
                            currentResult.status === "success" ? "text-green-600" : "text-red-600"
                          }`}>
                            {currentResult.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Execution Time:</span>
                        <p className="font-mono mt-1">{formatExecutionTime(currentResult.executionTime)}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Completed:</span>
                        <p className="mt-1">{new Date(currentResult.execution.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Output */}
                  {currentResult.output && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Program Output</label>
                      <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                          {currentResult.output}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {currentResult.error && (
                    <div>
                      <label className="text-sm font-medium text-red-700 mb-2 block">Error Output</label>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                        <pre className="text-sm text-red-700 font-mono whitespace-pre-wrap">
                          {currentResult.error}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* No output */}
                  {!currentResult.output && !currentResult.error && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Program executed successfully with no output</p>
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Execution History */}
        {executions.length > 1 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {executions.slice(0, 5).map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(execution.status)}
                      <span className="text-sm text-gray-600">
                        {new Date(execution.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatExecutionTime(execution.executionTime || 0)}</span>
                      <span className={`font-medium ${
                        execution.status === "success" ? "text-green-600" : "text-red-600"
                      }`}>
                        {execution.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}