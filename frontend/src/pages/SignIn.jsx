import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc"; // Using react-icons for Google logo
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <LogIn className="h-6 w-6" />
            Welcome Back
          </h1>
          <p className="text-blue-100 mt-1">
            Sign in to access your account
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <form className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-blue-900">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10 focus-visible:ring-blue-300"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-blue-900">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 focus-visible:ring-blue-300"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-blue-400" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <Button 
              variant="outline" 
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}