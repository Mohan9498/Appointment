import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await API.post("/register/", formData);
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
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="relative hidden lg:flex overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
          <div className="absolute top-16 left-16 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <UserPlus size={16} />
                Tiny Todds Therapy Care
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight tracking-tight">
                Create your account and start booking therapy sessions.
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                Join our platform to manage appointments, track therapy sessions,
                and connect with expert therapists.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-bold">Easy</p>
                <p className="mt-2 text-sm text-white/70">Quick registration process</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-3xl font-bold">Secure</p>
                <p className="mt-2 text-sm text-white/70">Safe &amp; protected system</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-10 bg-gradient-to-br from-white via-slate-50 to-sky-50">
          <div className="w-full max-w-md">

            <div className="mb-8 text-center lg:text-left">
              <Link to="/" className="inline-block text-sm font-medium text-slate-500 hover:text-slate-900">
                ← Back to Home
              </Link>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                Create account
              </h2>
              <p className="mt-2 text-slate-500">
                Sign up to get started with Tiny Todds Therapy.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 md:p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
              <form onSubmit={handleRegister} className="space-y-5">

                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-slate-900 focus:bg-white text-slate-900"
                    required
                  />
                </div>

                {/* Password */}
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
                      placeholder="Enter password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 outline-none focus:border-slate-900 focus:bg-white text-slate-900"
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

                {/* FIX: was `bg-white text-white` in light mode — invisible text on white button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-slate-700 disabled:opacity-70"
                >
                  {loading ? "Creating..." : "Create Account"}
                  {!loading && <ArrowRight size={18} />}
                </button>

              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-slate-900 hover:underline">
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
