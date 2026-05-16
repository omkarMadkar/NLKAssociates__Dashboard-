import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";
import LoginImage from "../assets/login.jpg";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const res = await API.post("/auth/login", {
        role,
        password,
      });

      // STORE TOKEN
      localStorage.setItem("token", res.data.token);

      // STORE ROLE
      localStorage.setItem("role", res.data.user.role);

      // REDIRECT
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#2f2f2f] p-5">
      {/* MAIN CARD */}
      <div className="w-full h-full bg-white overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="flex items-center justify-center px-10">
          <div className="w-full max-w-sm">
            {/* HEADING */}
            <h1 className="text-5xl font-bold text-black mb-3">
              Welcome Back!
            </h1>

            <p className="text-gray-500 text-sm mb-12">
              Welcome back please enter your details
            </p>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                >
                  <option value="admin">Admin</option>

                  <option value="staff">Staff</option>

                  <option value="senior">Senior Advocate</option>
                </select>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition"
                />
              </div>

              {/* ERROR */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-black hover:underline"
                >
                  Forgot password
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 hover:opacity-90 transition"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex h-screen overflow-hidden">
          <img
            src={LoginImage}
            alt="login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
