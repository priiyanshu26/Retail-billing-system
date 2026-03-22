import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../services/authService";
import Toast from "../../components/common/Toast";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerApi(formData);
      setToast({ message: "Account created successfully! Redirecting to login...", type: "success", duration: 2000 });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      
      // Check for specific error messages
      if (error.message.toLowerCase().includes("already exists") || 
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("username")) {
        errorMessage = "Username already exists. Please choose a different username.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setToast({ message: errorMessage, type: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join us to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <i className="icon">👤</i> Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                onChange={handleChange}
                value={formData.username}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="icon">🔐</i> Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                value={formData.password}
                className="form-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="register-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <a href="/login" className="login-link">
                Login here
              </a>
            </p>
          </div>
        </div>

        <div className="register-decoration">
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Register;
