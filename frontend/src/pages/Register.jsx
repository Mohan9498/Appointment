import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Eye, EyeOff, UserPlus, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import SEO from "../components/SEO";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateRegister = (values) => {
    const nextErrors = {};
    const username = values.username.trim();
    const password = values.password;

    if (!username) {
      nextErrors.username = "Username is required";
    } else if (username.length < 3) {
      nextErrors.username = "Username must be at least 3 characters";
    } else if (!/^[A-Za-z0-9_@.+-]+$/.test(username)) {
      nextErrors.username = "Use only letters, numbers, and @ . + - _";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    } else if (/^\d+$/.test(password)) {
      nextErrors.password = "Password cannot be only numbers";
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const nextData = { ...formData, [e.target.name]: e.target.value };

    setFormData(nextData);
    setErrors(validateRegister(nextData));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const nextErrors = validateRegister(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      setLoading(true);
      await API.post("/register/", {
        username: formData.username.trim(),
        password: formData.password,
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.log("FULL ERROR:", error);
      let message = "Registration failed";

      if (!error.response) {
        message = "Server not running or unreachable";
      } else if (error.response.data?.error) {
        message = error.response.data.error;
      } else if (typeof error.response.data === "object") {
        const firstKey = Object.keys(error.response.data)[0];
        message = error.response.data[firstKey][0];
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <SEO 
        title="Create Account" 
        description="Register for an account to start booking therapy sessions with Tiny Todds Therapy Care." 
        keywords="register, sign up, therapy account" 
      />
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
          <div className="absolute top-16 left-16 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, #6366F1 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                <UserPlus size={16} />
                Tiny Todds Therapy Care
              </div>

              <h1 className="mt-10 max-w-xl text-5xl font-extrabold leading-tight tracking-tight">
                Create your account and start booking therapy sessions.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/50">
                Join our platform to manage appointments, track therapy sessions,
                and connect with expert therapists.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
                <p className="text-3xl font-extrabold">Easy</p>
                <p className="mt-2 text-sm text-white/50">Quick registration process</p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm">
                <p className="text-3xl font-extrabold">Secure</p>
                <p className="mt-2 text-sm text-white/50">Safe &amp; protected system</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-10 bg-white dark:bg-slate-950">
          <div className="w-full max-w-md animate-fade-in-up">

            <div className="mb-8 text-center lg:text-left">
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
              <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Create account
              </h2>
              <p className="mt-2 text-gray-400 dark:text-gray-500 text-sm">
                Sign up to get started with Tiny Todds Therapy.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] p-6 md:p-8 shadow-sm">
              <form onSubmit={handleRegister} className="space-y-5">

                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    aria-invalid={Boolean(errors.username)}
                    className="w-full rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white transition-all duration-300 text-sm"
                    required
                  />
                  {errors.username && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      aria-invalid={Boolean(errors.password)}
                      className="w-full rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] px-4 py-3.5 pr-12 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white transition-all duration-300 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-glow-blue hover:scale-[1.01] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {loading ? "Creating..." : "Create Account"}
                  {!loading && <ArrowRight size={16} />}
                </button>

              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or</span>
                <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
              </div>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
