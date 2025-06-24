import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2, Play, Square, Clock, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PythonFile, Execution } from "@shared/schema";

interface OutputPanelProps {
  file: PythonFile | null;
  executionTrigger: number;
}

interface ExecutionResult {
  execution: Execution;
  output: string;
  error: string;
  executionTime: number;
  status: string;
}

export function OutputPanel({ file, executionTrigger }: OutputPanelProps) {
  const { toast } = useToast();

  const { data: executions = [] } = useQuery<Execution[]>({
    queryKey: ["/api/files", file?.id, "executions"],
    enabled: !!file?.id,
  });

  const executeMutation = useMutation({
    mutationFn: async (fileId: number): Promise<ExecutionResult> => {
      const response = await apiRequest("POST", `/api/execute/${fileId}`);
      return response.json();
    },
    onError: () => {
      toast({
        title: "Execution Error",
        description: "Failed to execute Python code.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (executionTrigger > 0 && file?.id) {
      executeMutation.mutate(file.id);
    }
  }, [executionTrigger, file?.id]);

  const latestExecution = executions[0];
  const result = executeMutation.data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
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

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Output Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-secondary">Output</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm">
              {executeMutation.isPending ? (
                <>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  <span className="text-gray-600">Executing...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-600">Ready</span>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Execution Info */}
      {currentResult && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Last run:</span>
              <span className="font-mono text-gray-800">
                {new Date(currentResult.execution.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Execution time:</span>
              <span className="font-mono text-gray-800">
                {formatExecutionTime(currentResult.executionTime)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(currentResult.status)}
                <span className={`font-mono text-sm ${getStatusColor(currentResult.status)}`}>
                  {currentResult.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Console Output */}
      <div className="flex-1 overflow-y-auto">
        {!file ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Play className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No file selected</p>
            </div>
          </div>
        ) : executeMutation.isPending ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm text-gray-600">Executing Python code...</p>
            </div>
          </div>
        ) : currentResult ? (
          <div className="p-4 font-mono text-sm space-y-3">
            {/* Standard Output */}
            {currentResult.output && (
              <div className="space-y-1">
                <div className="text-gray-600 text-xs uppercase tracking-wide">STDOUT</div>
                <div className="bg-gray-50 rounded p-3 border">
                  <pre className="text-gray-800 whitespace-pre-wrap text-xs">
                    {currentResult.output}
                  </pre>
                </div>
              </div>
            )}

            {/* Error Output */}
            {currentResult.error && (
              <div className="space-y-1">
                <div className="text-red-600 text-xs uppercase tracking-wide">STDERR</div>
                <div className="bg-red-50 rounded p-3 border border-red-200">
                  <pre className="text-red-700 whitespace-pre-wrap text-xs">
                    {currentResult.error}
                  </pre>
                </div>
              </div>
            )}

            {/* No output */}
            {!currentResult.output && !currentResult.error && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-sm">No output generated</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Play className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Click "Run Code" to execute</p>
            </div>
          </div>
        )}
      </div>

      {/* Execution Controls */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Button 
              className="flex-1 bg-accent text-white hover:bg-green-600"
              disabled={!file || executeMutation.isPending}
              onClick={() => file?.id && executeMutation.mutate(file.id)}
            >
              <Play className="mr-2 h-4 w-4" />
              Execute Code
            </Button>
            <Button 
              variant="destructive"
              size="sm"
              disabled={!executeMutation.isPending}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Timeout limit:</span>
              <span className="font-mono">30 seconds</span>
            </div>
            <div className="flex justify-between">
              <span>Memory limit:</span>
              <span className="font-mono">128 MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
