import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPythonFileSchema, updatePythonFileSchema, loginSchema } from "@shared/schema";
import { spawn } from "child_process";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import session from "express-session";
import MemoryStore from "memorystore";
import archiver from "archiver";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MemStore = MemoryStore(session);

// Session middleware
const sessionMiddleware = session({
  secret: "python-launcher-secret",
  resave: false,
  saveUninitialized: false,
  store: new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

// Authentication middleware
const requireAuth = (req: any, res: any, next: any) => {
  if (!(req.session as any).user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (!(req.session as any).user || (req.session as any).user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Add session middleware
  app.use(sessionMiddleware);

  // Auth routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.authenticateUser(username, password);
      
      if (user) {
        (req.session as any).user = user;
        res.json({ user: { id: user.id, username: user.username, role: user.role } });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", requireAuth, (req: any, res) => {
    const user = (req.session as any).user;
    res.json({ user: { id: user.id, username: user.username, role: user.role } });
  });

  // Get all Python files (requires authentication)
  app.get("/api/files", requireAuth, async (req, res) => {
    try {
      const files = await storage.getAllPythonFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Get a specific Python file
  app.get("/api/files/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await storage.getPythonFile(id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch file" });
    }
  });

  // Create a new Python file (admin only)
  app.post("/api/files", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertPythonFileSchema.parse(req.body);
      const file = await storage.createPythonFile(validatedData);
      res.status(201).json(file);
    } catch (error) {
      res.status(400).json({ message: "Invalid file data" });
    }
  });

  // Update a Python file (admin only)
  app.put("/api/files/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updatePythonFileSchema.parse(req.body);
      const file = await storage.updatePythonFile(id, validatedData);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(400).json({ message: "Invalid file data" });
    }
  });

  // Delete a Python file (admin only)
  app.delete("/api/files/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePythonFile(id);
      if (!deleted) {
        return res.status(404).json({ message: "File not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Execute Python code
  app.post("/api/execute/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const file = await storage.getPythonFile(id);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const startTime = Date.now();
      const tempDir = path.join(__dirname, "..", "temp");
      
      // Create temp directory if it doesn't exist
      try {
        await fs.mkdir(tempDir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }

      const tempFile = path.join(tempDir, `${file.id}_${Date.now()}.py`);
      
      try {
        // Write Python code to temporary file
        await fs.writeFile(tempFile, file.content);

        // Execute Python code with timeout
        const python = spawn("python3", [tempFile], {
          timeout: 30000, // 30 second timeout
          cwd: tempDir,
        });

        let stdout = "";
        let stderr = "";

        python.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        python.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        python.on("close", async (code) => {
          const executionTime = Date.now() - startTime;
          const status = code === 0 ? "success" : "error";
          
          try {
            // Clean up temp file
            await fs.unlink(tempFile);
          } catch (error) {
            // File cleanup failed, but continue
          }

          const execution = await storage.createExecution({
            fileId: id,
            output: stdout || null,
            error: stderr || null,
            executionTime,
            status,
          });

          res.json({
            execution,
            output: stdout,
            error: stderr,
            executionTime,
            status,
          });
        });

        python.on("error", async (error) => {
          const executionTime = Date.now() - startTime;
          
          try {
            await fs.unlink(tempFile);
          } catch (cleanupError) {
            // Cleanup failed
          }

          const execution = await storage.createExecution({
            fileId: id,
            output: null,
            error: error.message,
            executionTime,
            status: "error",
          });

          res.json({
            execution,
            output: "",
            error: error.message,
            executionTime,
            status: "error",
          });
        });

      } catch (fsError) {
        res.status(500).json({ 
          message: "Failed to create temporary file",
          error: fsError instanceof Error ? fsError.message : "Unknown error"
        });
      }

    } catch (error) {
      res.status(500).json({ message: "Execution failed" });
    }
  });

  // Get execution history for a file
  app.get("/api/files/:id/executions", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const executions = await storage.getExecutionsForFile(id);
      res.json(executions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch executions" });
    }
  });

  // Download project files as zip (admin only)
  app.get("/api/download-project", requireAdmin, async (req, res) => {
    try {
      const projectRoot = path.resolve(__dirname, "..");
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="pylauncher-project.zip"');

      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      archive.on('error', (err) => {
        res.status(500).send({ error: err.message });
      });

      archive.pipe(res);

      // Add all project files
      const filesToInclude = [
        // Root files
        'package.json',
        'package-lock.json',
        'tsconfig.json',
        'vite.config.ts',
        'tailwind.config.ts',
        'postcss.config.js',
        'drizzle.config.ts',
        'components.json',
        'replit.md',
        '.gitignore',
        '.replit'
      ];

      // Add root files
      for (const file of filesToInclude) {
        const filePath = path.join(projectRoot, file);
        try {
          await fs.access(filePath);
          archive.file(filePath, { name: file });
        } catch (error) {
          // File doesn't exist, skip it
        }
      }

      // Add directories
      const directoriesToInclude = [
        'client',
        'server', 
        'shared'
      ];

      for (const dir of directoriesToInclude) {
        const dirPath = path.join(projectRoot, dir);
        try {
          await fs.access(dirPath);
          archive.directory(dirPath, dir);
        } catch (error) {
          // Directory doesn't exist, skip it
        }
      }

      await archive.finalize();
    } catch (error) {
      res.status(500).json({ message: "Failed to create project archive" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
