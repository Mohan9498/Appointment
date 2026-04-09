import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const controllerRef = useRef(null); // ✅ store controller

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access");
    const isAdmin = localStorage.getItem("is_admin") === "true";

    if (token && isAdmin) {
      navigate("/admin", { replace: true });
    }

    // ✅ Cleanup: cancel request on unmount
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

  // ✅ Login with AbortController
  const handleLogin = async (e) => {
   e.preventDefault();

    const controller = new AbortController();
   controllerRef.current = controller;

     setLoading(true);
     setError("");

    try {
      const res = await API.post(
        "login/",
       formData,
       { signal: controller.signal }
      );

      // 🚨 BLOCK NON ADMIN
      if (!res.data.is_admin) {
       setError("Access denied. Admin only.");
        return;
     }

      // ✅ SAVE
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("is_admin", String(res.data.is_admin));

      navigate("/admin", { replace: true });

    } catch (err) {
      console.log(err);

      // ❌ Ignore cancel error
      if (err.name === "CanceledError") return;

      // ✅ HANDLE ERRORS PROPERLY
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid username or password");
        } else if (err.response.status === 400) {
          setError("Please fill all fields correctly");
       } else {
          setError(err.response.data?.detail || "Login failed");
        }
      } else if (err.request) {
        setError("Server not responding. Try again later.");
      } else {
        setError("Something went wrong");
      }
  
    } finally {
     setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black px-4">
      

      {/* 🔥 LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-sm">Signing in...</p>
          </div>
        </div>
      )}

      

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

          {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm animate-pulse">
                ⚠️ {error}
              </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;