import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const controllerRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
  };

  // ✅ Login with popup + retry + cancel
  const handleLogin = async (e, isRetry = false) => {
    if (e) e.preventDefault();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);

    try {
      toast.loading("Signing in...", { id: "login" });

      const res = await API.post("login/", formData, {
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
          message = "Invalid username or password";
        } else if (err.response.status === 400) {
          message = "Please fill all fields correctly";
        } else {
          message = err.response.data?.detail || "Login failed";
        }
      }

      // 🔥 Popup with Retry + Cancel
      toast((t) => (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-yellow-600">
            ⚠️ Access denied! Only admins can login.
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

          {/* LOGIN BUTTON */}
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

          {/* CANCEL BUTTON DURING LOADING */}
          {/* {loading && (
            <button
              type="button"
              onClick={() => controllerRef.current?.abort()}
              className="w-5/12 bg-gray-300 text-black py-2 rounded-xl hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )} */}

        </form>
      </div>
    </div>
  );
}

export default Login;