import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type FormData = {
  email: string;
  password: string;
};

type Errors = {
  email: string;
  password: string;
  general?: string;
};

export default function LoginForm(): JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Validation returns true when no errors
  const validate = (): boolean => {
    const newErrors: Errors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // If user is already logged in (from previous session), navigate once on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isAuthenticated || loggedIn) {
      navigate("/dashboard");
    }
    // only run on mount and when isAuthenticated changes
  }, [isAuthenticated, navigate]);

  // Make handler async — clearer and avoids mixing await + .then
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ email: "", password: "" }); // clear previous errors
    if (!validate()) return;

    setLoading(true);
    try {
      const backend = import.meta.env.VITE_BACKEND_URL;
      if (!backend) {
        throw new Error("Backend URL is not configured.");
      }

      const res = await axios.post(`${backend}/api/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.data?.success) {
        setIsAuthenticated(true);
        localStorage.setItem("isLoggedIn", "true");
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        if (res.data.user?.role) {
          localStorage.setItem("role", res.data.user.role);
        }
        navigate("/dashboard");
      } else {
        // handle backend-level failure message
        setErrors((prev) => ({
          ...prev,
          general: res.data?.message || "Login failed",
        }));
      }
    } catch (err: any) {
      // network / unexpected error handling
      const msg =
        err?.response?.data?.message || err.message || "An error occurred";
      setErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          style={{ width: "400px", height: "auto" }}
          className="w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 bg-white"
        >
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <LogIn className="w-6 h-6" /> Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* General error */}
              {errors.general && (
                <p className="text-red-600 text-sm mb-2 flex items-center gap-2">
                  <AlertCircle size={16} /> {errors.general}
                </p>
              )}

              {/* Email */}
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={errors.email ? "border-red-500" : ""}
                  style={{ marginTop: "18px" }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={14} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className={errors.password ? "border-red-500" : ""}
                    style={{ marginTop: "18px" }}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                  >
                    <AlertCircle size={14} /> {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  width: "100%",
                  marginTop: "25px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="flex justify-start text-sm text-gray-500 mt-6">
              <a
                href="#"
                className="hover:text-blue-600 transition"
                style={{ color: "gray", marginTop: "10px " }}
              >
                Forgot Password?
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
