// src/pages/SignIn.jsx
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="container max-w-md py-16">
      <div className="border rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded"
            />
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-blue-600">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}