import { pgTable, text, serial, integer, timestamp, boolean, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "admin" or "user"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pythonFiles = pgTable("python_files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const executions = pgTable("executions", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").notNull(),
  output: text("output"),
  error: text("error"),
  executionTime: integer("execution_time"), // in milliseconds
  status: text("status").notNull(), // 'success', 'error', 'timeout'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const insertPythonFileSchema = createInsertSchema(pythonFiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePythonFileSchema = createInsertSchema(pythonFiles).pick({
  name: true,
  content: true,
}).extend({
  size: z.number().min(0),
});

export const insertExecutionSchema = createInsertSchema(executions).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type PythonFile = typeof pythonFiles.$inferSelect;
export type InsertPythonFile = z.infer<typeof insertPythonFileSchema>;
export type UpdatePythonFile = z.infer<typeof updatePythonFileSchema>;
export type Execution = typeof executions.$inferSelect;
export type InsertExecution = z.infer<typeof insertExecutionSchema>;
