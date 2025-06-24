# PyLauncher - Role-Based Python Program Execution Platform

## Overview

PyLauncher is a secure, role-based Python program execution platform with authentication and different user interfaces. The system allows administrators to upload and manage Python programs, while regular users can execute these programs through a terminal-style interface. Features include session-based authentication, real-time program execution, and complete project downloadability for deployment on other Replit instances.

## System Architecture

### Authentication System
- **Session Management**: Express sessions with PostgreSQL storage
- **Role-Based Access**: Admin and User roles with different capabilities
- **Security**: Session-based authentication with proper middleware
- **Default Accounts**: Admin (admin/admin123) and User (user/user123)

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state management
- **Authentication**: Custom useAuth hook with state management

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with role-based route protection
- **Process Management**: Child process spawning for Python code execution
- **Session Storage**: PostgreSQL-backed session persistence
- **File Export**: ZIP archive generation for project distribution

### Database & ORM
- **Database**: PostgreSQL with Neon serverless connection
- **ORM**: Drizzle ORM with schema-first approach
- **Tables**: Users, Python files, executions, and sessions
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Role-Based User Interfaces

#### Admin Dashboard
- **Program Management**: Upload, edit, and delete Python programs
- **Visual Interface**: Card-based program selection with metadata
- **Project Export**: Download complete project as ZIP file for Replit deployment
- **Execution Testing**: Run programs with detailed output display

#### User Terminal Interface  
- **Command-Line Style**: Terminal emulation with command processing
- **Program Execution**: Commands like 'list', 'run program.py', 'show program.py'
- **Real-Time Output**: Live stdout/stderr display with execution metrics
- **Read-Only Access**: Cannot modify or upload programs

### Core System Components
- **Authentication System**: Login/logout with session persistence
- **File Storage**: Database-backed Python program storage
- **Execution Engine**: Isolated Python process spawning with timeout control
- **Export System**: Complete project packaging for redistribution

## Data Flow

1. **File Upload**: Client uploads Python files via drag-and-drop interface
2. **File Storage**: Files are validated, processed, and stored in PostgreSQL
3. **Code Editing**: Users can modify file content in the integrated editor
4. **Execution Request**: Client sends execution request for selected file
5. **Process Spawning**: Server spawns isolated Python process for code execution
6. **Result Capture**: Server captures output, errors, and execution metrics
7. **Real-time Updates**: Results are sent back to client and displayed immediately

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool and development server

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit infrastructure
- **Database**: PostgreSQL 16 module
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend
- **Port Configuration**: Server runs on port 5000, exposed on port 80

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Autoscale deployment target on Replit
- **Process**: Single Node.js process serving both API and static files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **Static Serving**: Express serves Vite-built frontend in production

## How to Deploy on Replit

### For Users Who Want to Copy This Project:

1. **Download the Project**:
   - Log in as admin (username: admin, password: admin123)
   - Click the "Download Project" button in the admin dashboard
   - Save the `pylauncher-project.zip` file to your computer

2. **Create New Replit**:
   - Go to replit.com and create a new Repl
   - Choose "Import from ZIP" option
   - Upload the downloaded `pylauncher-project.zip` file

3. **Set Up Database**:
   - In your new Repl, go to the Database tab
   - Create a PostgreSQL database
   - Run `npm run db:push` to set up the schema

4. **Install Dependencies**:
   - Run `npm install` to install all dependencies
   - The project will automatically create default admin/user accounts

5. **Run the Project**:
   - Use `npm run dev` to start the development server
   - Access the login page and use the default credentials

### Default Login Credentials:
- **Admin**: username: admin, password: admin123 (can upload/manage programs)
- **User**: username: user, password: user123 (terminal interface only)

## Changelog

- June 24, 2025: Initial PyExec setup
- June 24, 2025: Complete rewrite to PyLauncher with authentication system
- June 24, 2025: Added role-based access control and terminal interface
- June 24, 2025: Implemented project download functionality for Replit deployment

## User Preferences

Preferred communication style: Simple, everyday language.