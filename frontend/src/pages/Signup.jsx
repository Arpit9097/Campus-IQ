import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import './Signup.css';

const Signup = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, and a number.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/signup`,
  {
    name: formData.name.trim(),
    email: formData.email.toLowerCase(),
    password: formData.password
  }
);
      setSuccessMessage("Account created successfully! Redirecting...");
      login(res.data.token);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed. Please try again.";
      if (errorMessage.includes("email")) {
        setErrors({ email: "This email is already registered." });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="signup-container relative">
      {/* Background Glow */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Main Card */}
      <div className="glass-card signup-card relative z-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-gradient signup-header-title">
            Create Account
          </h1>
          <p className="signup-header-subtitle">
            Join CampusIQ for your placement journey.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert-success">
            {successMessage}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="alert-danger">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name" className="hidden">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="name"
                type="text"
                required
                disabled={loading}
                className={`form-input ${errors.name ? 'border-danger' : ''}`}
                style={errors.name ? { borderColor: 'var(--danger)' } : {}}
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="hidden">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                className={`form-input ${errors.email ? 'border-danger' : ''}`}
                style={errors.email ? { borderColor: 'var(--danger)' } : {}}
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
          </div>

          {/* Passwords - Side by Side */}
          <div className="password-grid">
            <div>
              <label htmlFor="password" className="hidden">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  className={`form-input password-input ${errors.password ? 'border-danger' : ''}`}
                  style={errors.password ? { borderColor: 'var(--danger)' } : {}}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                <button type="button" className="input-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="hidden">Confirm</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  className={`form-input password-input ${errors.confirmPassword ? 'border-danger' : ''}`}
                  style={errors.confirmPassword ? { borderColor: 'var(--danger)' } : {}}
                  placeholder="Confirm"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                />
                <button type="button" className="input-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          {(errors.password || errors.confirmPassword) && (
            <div className="text-xs text-danger mb-4 text-center">
              {errors.password || errors.confirmPassword}
            </div>
          )}

          {/* Button */}
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="signup-footer">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;