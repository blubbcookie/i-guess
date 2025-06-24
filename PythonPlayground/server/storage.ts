import { users, pythonFiles, executions, type User, type InsertUser, type PythonFile, type InsertPythonFile, type UpdatePythonFile, type Execution, type InsertExecution } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  
  // Python files
  getAllPythonFiles(): Promise<PythonFile[]>;
  getPythonFile(id: number): Promise<PythonFile | undefined>;
  createPythonFile(file: InsertPythonFile): Promise<PythonFile>;
  updatePythonFile(id: number, file: UpdatePythonFile): Promise<PythonFile | undefined>;
  deletePythonFile(id: number): Promise<boolean>;
  
  // Executions
  getExecutionsForFile(fileId: number): Promise<Execution[]>;
  createExecution(execution: InsertExecution): Promise<Execution>;
  getLatestExecution(fileId: number): Promise<Execution | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pythonFiles: Map<number, PythonFile>;
  private executions: Map<number, Execution>;
  private currentUserId: number;
  private currentFileId: number;
  private currentExecutionId: number;

  constructor() {
    this.users = new Map();
    this.pythonFiles = new Map();
    this.executions = new Map();
    this.currentUserId = 1;
    this.currentFileId = 1;
    this.currentExecutionId = 1;
    
    // Create default users
    setTimeout(async () => {
      await this.createUser({
        username: "admin",
        password: "admin123",
        role: "admin"
      });
      
      await this.createUser({
        username: "user",
        password: "user123", 
        role: "user"
      });
    }, 0);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role || "user",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllPythonFiles(): Promise<PythonFile[]> {
    return Array.from(this.pythonFiles.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getPythonFile(id: number): Promise<PythonFile | undefined> {
    return this.pythonFiles.get(id);
  }

  async createPythonFile(insertFile: InsertPythonFile): Promise<PythonFile> {
    const id = this.currentFileId++;
    const now = new Date();
    const file: PythonFile = {
      ...insertFile,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.pythonFiles.set(id, file);
    return file;
  }

  async updatePythonFile(id: number, updateFile: UpdatePythonFile): Promise<PythonFile | undefined> {
    const existingFile = this.pythonFiles.get(id);
    if (!existingFile) {
      return undefined;
    }

    const updatedFile: PythonFile = {
      ...existingFile,
      ...updateFile,
      updatedAt: new Date(),
    };
    this.pythonFiles.set(id, updatedFile);
    return updatedFile;
  }

  async deletePythonFile(id: number): Promise<boolean> {
    return this.pythonFiles.delete(id);
  }

  async getExecutionsForFile(fileId: number): Promise<Execution[]> {
    return Array.from(this.executions.values())
      .filter(exec => exec.fileId === fileId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createExecution(insertExecution: InsertExecution): Promise<Execution> {
    const id = this.currentExecutionId++;
    const execution: Execution = {
      id,
      fileId: insertExecution.fileId,
      output: insertExecution.output || null,
      error: insertExecution.error || null,
      executionTime: insertExecution.executionTime || null,
      status: insertExecution.status,
      createdAt: new Date(),
    };
    this.executions.set(id, execution);
    return execution;
  }

  async getLatestExecution(fileId: number): Promise<Execution | undefined> {
    const executions = await this.getExecutionsForFile(fileId);
    return executions[0];
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
}

export const storage = new MemStorage();
