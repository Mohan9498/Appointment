import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const controllerRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

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
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // ✅ Login with retry + cancel
  const handleLogin = async (e, isRetry = false) => {
    if (e) e.preventDefault();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");
    if (isRetry) setRetrying(true);

    try {
      const res = await API.post("login/", formData, {
        timeout: 10000,
        signal: controller.signal,
      });

      if (!res.data.is_admin) {
        setError("Access denied. Admin only.");
        return;
      }

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("is_admin", String(res.data.is_admin));

      navigate("/admin", { replace: true });

    } catch (err) {
      console.log(err);

      if (err.name === "CanceledError") {
        setError("Login cancelled");
        return;
      }

      // 🔥 HANDLE SLOW SERVER (IMPORTANT)
      if (err.code === "ECONNABORTED" && !isRetry) {
        setError("Waking server... please wait ⏳");

        try {
          const res = await API.post("login/", formData);

          localStorage.setItem("access", res.data.access);
          localStorage.setItem("is_admin", String(res.data.is_admin));

          navigate("/admin", { replace: true });
          return;

        } catch {
          setError("Server is still slow. Please retry.");
        }

      } else if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid username or password");
        } else if (err.response.status === 400) {
          setError("Please fill all fields correctly");
        } else {
          setError(err.response.data?.detail || "Login failed");
        }
      } else {
        setError("Server not responding. Try again.");
      }
    

    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-white/15 px-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">

        <div className="mb-6 text-center">
          <Link to="/" className="text-sm text-gray-500 hover:text-black">
            ← Back to Home
          </Link>

          <h2 className="text-2xl font-bold mt-2 text-black dark:text-white">
            Admin Login
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl dark:bg-gray-800 dark:text-white"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl pr-10 dark:bg-gray-800 dark:text-white"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* 🔴 ERROR */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* 🔵 LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* 🔴 CANCEL BUTTON */}
          {loading && (
            <button
              type="button"
              onClick={() => controllerRef.current?.abort()}
              className="w-full bg-gray-300 text-black py-2 rounded-xl hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}

          {/* 🟢 RETRY BUTTON */}
          {error && !loading && (
            <button
              type="button"
              onClick={() => handleLogin(null, true)}
              className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
            >
              {retrying ? "Retrying..." : "Retry"}
            </button>
          )}

          {/* 🔄 SMALL LOADER */}
          {loading && (
            <div className="flex items-center justify-center gap-2 text-blue-600 text-sm mt-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

export default Login;