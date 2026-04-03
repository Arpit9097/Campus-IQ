import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      login(res.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email: forgotEmail }
      );
      setMessage("Password reset link sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container relative">
      {/* Background Glow */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="glass-card login-card relative z-10">
        <h1 className="text-gradient login-header-title">CampusIQ</h1>
        <p className="login-header-subtitle">
          {showForgot ? "Reset your password" : "Login to continue"}
        </p>

        {error && <p className="text-danger">{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        {/* LOGIN FORM */}
        {!showForgot ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  color: "#4F46E5",
                }}
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </span>
            </div>

            <button className="btn btn-primary mt-4" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        ) : (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <input
                type="email"
                className="form-input"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary mt-4" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p
              style={{
                marginTop: "1rem",
                cursor: "pointer",
                color: "#4F46E5",
              }}
              onClick={() => setShowForgot(false)}
            >
              ← Back to Login
            </p>
          </form>
        )}

        {!showForgot && (
          <p className="login-footer">
            Don't have an account?{" "}
            <span
              className="login-footer-link"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
