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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const res = await API.post("login/", formData); 
      // ❌ Block non-admin users
      if (!res.data.is_admin) {
        alert("Access denied. Admin only.");
        return;
      }
      
      // ✅ Save tokens
    
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("is_admin", res.data.is_admin);
      localStorage.setItem("username", res.data.username);

      // ✅ Zustand store
      loginStore.login(
        {
          username: res.data.username,
          is_admin: res.data.is_admin,
        },
        res.data.access
      );

      // ✅ ONLY ADMIN REDIRECT
      navigate("/admin");

    } catch (error) {
      console.log(error);
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden lg:flex overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
          <div className="absolute top-16 left-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <ShieldCheck size={16} />
                Tiny Todds Therapy Care
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight tracking-tight">
                A calmer, smarter way to manage child therapy appointments.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                Secure access for clients and administrators with appointment
                booking, approval workflow, and program management in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-bold">24/7</p>
                <p className="mt-2 text-sm text-white/70">
                  Online appointment requests
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-bold">Fast</p>
                <p className="mt-2 text-sm text-white/70">
                  Admin approval and tracking
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 bg-gradient-to-br from-white via-slate-50 to-sky-50">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <Link
                to="/"
                className="inline-block text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                ← Back to Home
              </Link>

              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>
              <p className="mt-2 text-slate-500">
                Sign in to continue to your dashboard.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 md:p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
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
                    placeholder="Enter your username"
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
                      placeholder="Enter your password"
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-500">
                    <input type="checkbox" className="rounded" />
                    Remember me
                  </label>

                  <Link
                    to="/forget-password"
                    className="font-medium text-slate-900 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-slate-800 disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-slate-900 hover:underline"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;