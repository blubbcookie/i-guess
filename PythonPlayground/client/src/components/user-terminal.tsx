import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, Play, Square, Clock, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PythonFile, Execution } from "@shared/schema";

interface UserTerminalProps {
  onLogout: () => void;
}

interface ExecutionResult {
  execution: Execution;
  output: string;
  error: string;
  executionTime: number;
  status: string;
}

export function UserTerminal({ onLogout }: UserTerminalProps) {
  const [selectedProgram, setSelectedProgram] = useState<PythonFile | null>(null);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "PyLauncher Terminal - Welcome!",
    "Type commands to interact with Python programs:",
    "- 'list' to see available programs",
    "- 'run <program_name>' to execute a program",
    "- 'help' for more commands",
    ""
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: programs = [], refetch: refetchPrograms } = useQuery<PythonFile[]>({
    queryKey: ["/api/files"],
  });

  const executeMutation = useMutation({
    mutationFn: async (fileId: number): Promise<ExecutionResult> => {
      const response = await apiRequest("POST", `/api/execute/${fileId}`);
      return response.json();
    },
    onSuccess: (result) => {
      addToTerminal(`\n=== Execution Results ===`);
      addToTerminal(`Status: ${result.status}`);
      addToTerminal(`Time: ${formatExecutionTime(result.executionTime)}`);
      
      if (result.output) {
        addToTerminal(`\nOutput:`);
        addToTerminal(result.output);
      }
      
      if (result.error) {
        addToTerminal(`\nErrors:`);
        addToTerminal(result.error);
      }
      
      if (!result.output && !result.error) {
        addToTerminal("No output generated");
      }
      
      addToTerminal("");
    },
    onError: () => {
      addToTerminal("Error: Failed to execute program");
      addToTerminal("");
    },
  });

  const addToTerminal = (text: string) => {
    setTerminalHistory(prev => [...prev, text]);
  };

  const formatExecutionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(3)}s`;
  };

  const handleCommand = (input: string) => {
    const trimmedInput = input.trim();
    addToTerminal(`> ${trimmedInput}`);

    if (!trimmedInput) {
      addToTerminal("");
      return;
    }

    const [command, ...args] = trimmedInput.toLowerCase().split(" ");

    switch (command) {
      case "help":
        addToTerminal("Available commands:");
        addToTerminal("  list                 - Show all available programs");
        addToTerminal("  run <program_name>   - Execute a Python program");
        addToTerminal("  show <program_name>  - Display program details");
        addToTerminal("  clear                - Clear terminal");
        addToTerminal("  logout               - Sign out");
        addToTerminal("");
        break;

      case "list":
        if (programs.length === 0) {
          addToTerminal("No programs available");
        } else {
          addToTerminal("Available programs:");
          programs.forEach((program, index) => {
            addToTerminal(`  ${index + 1}. ${program.name}`);
          });
        }
        addToTerminal("");
        break;

      case "run":
        if (args.length === 0) {
          addToTerminal("Error: Please specify a program name");
          addToTerminal("Usage: run <program_name>");
        } else {
          const programName = args.join(" ");
          const program = programs.find(p => 
            p.name.toLowerCase() === programName.toLowerCase() ||
            p.name.toLowerCase() === `${programName.toLowerCase()}.py`
          );
          
          if (program) {
            addToTerminal(`Executing ${program.name}...`);
            executeMutation.mutate(program.id);
          } else {
            addToTerminal(`Error: Program '${programName}' not found`);
            addToTerminal("Use 'list' to see available programs");
          }
        }
        addToTerminal("");
        break;

      case "show":
        if (args.length === 0) {
          addToTerminal("Error: Please specify a program name");
          addToTerminal("Usage: show <program_name>");
        } else {
          const programName = args.join(" ");
          const program = programs.find(p => 
            p.name.toLowerCase() === programName.toLowerCase() ||
            p.name.toLowerCase() === `${programName.toLowerCase()}.py`
          );
          
          if (program) {
            addToTerminal(`Program: ${program.name}`);
            addToTerminal(`Size: ${Math.round(program.size / 1024 * 100) / 100} KB`);
            addToTerminal(`Modified: ${new Date(program.updatedAt).toLocaleString()}`);
            addToTerminal(`\nCode preview:`);
            const lines = program.content.split('\n').slice(0, 10);
            lines.forEach(line => addToTerminal(`  ${line}`));
            if (program.content.split('\n').length > 10) {
              addToTerminal("  ... (truncated)");
            }
          } else {
            addToTerminal(`Error: Program '${programName}' not found`);
          }
        }
        addToTerminal("");
        break;

      case "clear":
        setTerminalHistory([
          "PyLauncher Terminal - Welcome!",
          "Type 'help' for available commands",
          ""
        ]);
        break;

      case "logout":
        onLogout();
        break;

      default:
        addToTerminal(`Unknown command: ${command}`);
        addToTerminal("Type 'help' for available commands");
        addToTerminal("");
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !executeMutation.isPending) {
      handleCommand(currentInput);
      setCurrentInput("");
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Terminal className="h-6 w-6 text-green-400" />
            <div>
              <h1 className="text-xl font-bold text-white">PyLauncher Terminal</h1>
              <p className="text-sm text-gray-400">User Mode - Execute Python Programs</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-900 text-green-100">
              {programs.length} programs available
            </Badge>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="bg-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <Terminal className="mr-2 h-5 w-5" />
              Terminal Interface
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Terminal Output */}
            <div 
              ref={terminalRef}
              className="bg-black border border-gray-700 rounded p-4 h-96 overflow-y-auto mb-4 font-mono text-sm"
            >
              {terminalHistory.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              {executeMutation.isPending && (
                <div className="text-yellow-400">
                  Executing program...
                </div>
              )}
            </div>

            {/* Terminal Input */}
            <div className="flex items-center space-x-2">
              <span className="text-green-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-green-400 outline-none font-mono"
                placeholder="Type a command..."
                disabled={executeMutation.isPending}
              />
              {executeMutation.isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">Quick Commands</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <div><code className="text-green-400">list</code> - Show programs</div>
                <div><code className="text-green-400">run program.py</code> - Execute</div>
                <div><code className="text-green-400">help</code> - Show all commands</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">Available Programs</h3>
              <div className="text-sm text-gray-400">
                {programs.length === 0 ? (
                  "No programs uploaded yet"
                ) : (
                  `${programs.length} program${programs.length !== 1 ? 's' : ''} ready to run`
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-400">Terminal Ready</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}