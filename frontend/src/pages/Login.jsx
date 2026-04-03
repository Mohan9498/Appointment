import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ FIXED: useEffect OUTSIDE handleLogin
  useEffect(() => {
    const token = localStorage.getItem("access");
    const isAdmin = localStorage.getItem("is_admin") === "true";

    // ✅ only redirect if already on login page
    if (window.location.pathname === "/login" && token && isAdmin) {
      navigate("/admin", { replace: true });
    }
    }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMsg("");

      const res = await API.post("login/", formData);

      // ❌ BLOCK NON-ADMIN LOGIN
      if (!res.data.is_admin) {
        setErrorMsg("Access denied. Admin only.");
        return;
      }

      // ✅ SAVE TOKENS
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("is_admin", String(res.data.is_admin));
      localStorage.setItem("username", res.data.username);

      // ✅ STORE LOGIN STATE
      loginStore.login(
        {
          username: res.data.username,
          is_admin: res.data.is_admin,
        },
        res.data.access
      );

      // ✅ REDIRECT
      navigate("/admin", { replace: true });

    } catch (error) {
      console.log(error);

      if (error.response?.status === 403) {
        setErrorMsg("Access denied. Admin only.");
      } else if (error.response?.status === 401) {
        setErrorMsg("Invalid username or password.");
      } else {
        setErrorMsg("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-white/5">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
          <div className="absolute left-16 top-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <ShieldCheck size={16} />
                Tiny Todds Therapy Care
              </div>

              <h1 className="mt-8 max-w-xl text-6xl font-bold leading-tight tracking-tight">
                Secure admin access for appointment management.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                Manage bookings, approvals, and therapy appointments securely.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-sky-50 px-6 py-10">
          <div className="w-full max-w-md">

            <div className="mb-8 text-center lg:text-left">
              <Link
                to="/"
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                ← Back to Home
              </Link>

              <h2 className="mt-4 text-4xl font-bold text-slate-900">
                Admin Login
              </h2>

              <p className="mt-2 text-slate-500">
                Only administrators can access the dashboard.
              </p>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-lg">

              <form onSubmit={handleLogin} className="space-y-5">

                {/* USERNAME */}
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full p-3 border rounded-xl"
                  required
                />

                {/* PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-3 border rounded-xl pr-10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* ERROR */}
                {errorMsg && (
                  <p className="text-red-500 text-sm">{errorMsg}</p>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;