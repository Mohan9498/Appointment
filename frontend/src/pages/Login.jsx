import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "../components/SEO";

function Login() {
  const navigate = useNavigate();
  const controllerRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateLogin = (values) => {
    const nextErrors = {};
    const username = values.username.trim();
    const password = values.password;

    if (!username) {
      nextErrors.username = "Username is required";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    }

    return nextErrors;
  };

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access");
    const isAdmin = localStorage.getItem("is_admin") === "true";

    if (token && isAdmin) {
      navigate("/admin", { replace: true });
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [navigate]);

  // ✅ Handle input
  const handleChange = (e) => {
    const nextData = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(nextData);
    setErrors(validateLogin(nextData));
  };

  // ✅ Login with popup + retry + cancel
  const handleLogin = async (e, isRetry = false) => {
    if (e) e.preventDefault();

    const nextErrors = validateLogin(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      toast.error("Please enter username and password");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);

    try {
      toast.loading("Signing in...", { id: "login" });

      const payload = {
        username: formData.username.trim(),
        password: formData.password,
      };

      const res = await API.post("login/", payload, {
        timeout: 10000,
        signal: controller.signal,
      });

      if (!res.data.is_admin) {
        toast.dismiss("login");
        toast.error("Access denied. Admin only.");
        return;
      }

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("is_admin", String(res.data.is_admin));

      toast.dismiss("login");
      toast.success("Login successful 🎉");

      navigate("/admin", { replace: true });

    } catch (err) {
      console.log(err);
      toast.dismiss("login");

      if (err.name === "CanceledError") {
        toast("Login cancelled ❌");
        return;
      }

      let message = "Server not responding";

      if (err.response) {
        if (err.response.status === 401) {
          message = err.response.data?.error || "Invalid username or password";
        } else if (err.response.status === 400) {
          message = err.response.data?.error || "Please fill all fields correctly";
        } else {
          message = err.response.data?.error || err.response.data?.detail || "Login failed";
        }
      }

      // 🔥 Popup with Retry + Cancel
      toast((t) => (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-yellow-600">
            ⚠️ {message}
          </span>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Close
            </button>
            
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setFormData({ username: "", password: "" });
              }}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Clear
            </button>
          </div>
        </div>
      ));
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      <SEO 
        title="Admin Login" 
        description="Secure admin login portal for Tiny Todds Therapy Care dashboard." 
        keywords="admin login, therapy care portal, secure access" 
      />

      {/* Background Decoration */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300/15 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative animate-scale-in">
        
        {/* Card */}
        <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] p-8 md:p-10 rounded-2xl shadow-premium dark:shadow-premium-dark">

          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <div className="w-16 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mt-6 mb-4 shadow-glow-blue">
              <Lock size={24} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Admin Login
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Sign in to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                aria-invalid={Boolean(errors.username)}
                className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                required
              />
              {errors.username && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.password)}
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] pr-12 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-sm hover:shadow-glow-blue hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
