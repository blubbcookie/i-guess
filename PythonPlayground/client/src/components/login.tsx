import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, User, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginData } from "@shared/schema";

export function Login() {
  const { login, loginError, isLoggingIn } = useAuth();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginData) => {
    login(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Code className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            PyLauncher Login
          </CardTitle>
          <p className="text-gray-600">Sign in to access Python programs</p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {loginError instanceof Error ? loginError.message : "Invalid credentials"}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          {...field} 
                          placeholder="Enter your username"
                          className="pl-10"
                          disabled={isLoggingIn}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                          {...field} 
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10"
                          disabled={isLoggingIn}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="bg-gray-50 p-2 rounded">
                <strong>Admin:</strong> username: admin, password: admin123
                <br />
                <span className="text-green-600">Can upload and manage programs</span>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <strong>User:</strong> username: user, password: user123
                <br />
                <span className="text-blue-600">Can run programs with terminal interface</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}