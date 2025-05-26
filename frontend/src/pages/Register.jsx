import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register as registerUser } from "@/api/auth"; // Your API function

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    register_as: "customer",
    agency_name: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      validatePasswordStrength(value);
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validatePasswordStrength = (password) => {
    let strength = "";
    if (password.length < 6) {
      strength = "Too short";
    } else if (!/[A-Z]/.test(password)) {
      strength = "Add uppercase";
    } else if (!/[a-z]/.test(password)) {
      strength = "Add lowercase";
    } else if (!/[0-9]/.test(password)) {
      strength = "Add number";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      strength = "Add symbol";
    } else {
      strength = "Strong";
    }
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const validationErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value && key !== "agency_name") {
        validationErrors[key] = "This field is required";
      }
    });
    if (formData.password !== formData.confirm_password) {
      validationErrors.confirm_password = "Passwords do not match";
    }
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating account...");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.dismiss(toastId);
      setLoading(false);
      return;
    }

    try {
      // Remove agency_name for customer registration
      const { first_name, last_name, email, password, confirm_password, register_as } = formData;
      const payload = { first_name, last_name, email, password, confirm_password, register_as };

      console.log("Registering with:", payload);
      await registerUser(payload);
      toast.success("Registration successful!", { id: toastId });
      navigate("/signin");
    } catch (error) {
      const msg = error?.response?.data?.detail || "Registration failed";
      toast.error(msg, { id: toastId });
      console.error("Registration error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <User className="h-6 w-6" /> Create Your Account
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <Input name="first_name" value={formData.first_name} onChange={handleChange} className="p-3" />
              {errors.first_name && <p className="text-red-500 text-xs">{errors.first_name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <Input name="last_name" value={formData.last_name} onChange={handleChange} className="p-3" />
              {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} className="p-3" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="p-3 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              {formData.password && (
                <p className={`text-xs mt-1 ${passwordStrength === "Strong" ? "text-green-600" : "text-yellow-600"}`}>
                  Password strength: {passwordStrength}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="p-3"
              />
              {errors.confirm_password && <p className="text-red-500 text-xs">{errors.confirm_password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Registering As</label>
              <Input value="Customer" readOnly className="bg-gray-100 cursor-not-allowed p-3" />
              <p className="text-xs text-gray-500 mt-1">
                Want to register as an Agent?{" "}
                <a href="https://wa.me/263YOURNUMBER" target="_blank" className="text-blue-600 underline">
                  Contact us via WhatsApp
                </a>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/signin" className="font-medium text-indigo-600 hover:text-indigo-800">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
