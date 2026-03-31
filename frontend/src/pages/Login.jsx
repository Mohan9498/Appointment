import { useState } from "react";
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

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("is_admin", String(res.data.is_admin));
      localStorage.setItem("username", res.data.username);

      loginStore.login(
        {
          username: res.data.username,
          is_admin: res.data.is_admin,
        },
        res.data.access
      );

      // ✅ redirect AFTER store update
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
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
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

              <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight tracking-tight">
                Secure admin access for appointment management.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                This portal is restricted to administrators only. Manage bookings,
                approvals, and child therapy appointments securely from one dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-bold">Admin</p>
                <p className="mt-2 text-sm text-white/70">
                  Restricted access only
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-bold">Secure</p>
                <p className="mt-2 text-sm text-white/70">
                  Protected dashboard control
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-sky-50 px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <Link
                to="/"
                className="inline-block text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                ← Back to Home
              </Link>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                Admin Login
              </h2>
              <p className="mt-2 text-slate-500">
                Only administrators can sign in to access the dashboard.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter admin username"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter admin password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white dark:bg-black text-black dark:text-white px-6 py-3.5 text-sm font-semibold  transition hover:scale-[1.01] hover:bg-slate-800 disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign In to Admin Dashboard"}
                  {!loading && <ArrowRight size={18} />}
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