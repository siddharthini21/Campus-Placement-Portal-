import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, GraduationCap, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import API from "../api/axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-12"
      style={{ backgroundColor: "#f8fafc", color: "#111111" }}
    >
      {/* Main Crisp White Card */}
      <div
        className="w-full max-w-md rounded-2xl p-8 sm:p-10 border border-gray-200 shadow-lg"
        style={{ backgroundColor: "#ffffff", color: "#111111" }}
      >
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-gray-200 shadow-sm mb-4"
            style={{ backgroundColor: "#ffffff" }}
          >
            <GraduationCap size={28} style={{ color: "#111111" }} />
          </div>
          <p className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: "#64748b" }}>
            Smart Campus Recruitment
          </p>
          <h1 className="font-[Fraunces] text-3xl font-semibold mb-2" style={{ color: "#0f172a" }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "#475569" }}>
            Log in to continue to your placement portal
          </p>
        </div>

        {error && (
          <div
            className="flex items-start gap-3 text-sm px-4 py-3 rounded-xl mb-6 border border-red-200"
            style={{ backgroundColor: "#fef2f2", color: "#b91c1c" }}
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "#334155" }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "#94a3b8" }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200 shadow-sm"
                style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "#334155" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: "#94a3b8" }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-300 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-200 shadow-sm"
                style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
              />
            </div>
          </div>

          {/* Light / White Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 font-semibold py-3 px-4 rounded-xl border border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
            style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin text-gray-700" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Log in</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                  style={{ color: "#475569" }}
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm" style={{ color: "#475569" }}>
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold hover:underline ml-1"
              style={{ color: "#0f172a" }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Subtle Footer */}
      <p className="text-xs mt-8 text-center" style={{ color: "#94a3b8" }}>
        © 2026 Smart Campus Recruitment Portal · All rights reserved
      </p>
    </div>
  );
}

export default Login;