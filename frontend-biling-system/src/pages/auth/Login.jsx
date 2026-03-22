import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { decodeToken } from "../../utils/roleUtils";
import Toast from "../../components/common/Toast";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginApi(formData);
      login(response.token);

      // Decode token to check actual role
      const decoded = decodeToken(response.token);
      const userRole = decoded?.authorities?.[0];

      setToast({ message: "Login successful! Redirecting...", type: "success", duration: 2000 });
      setTimeout(() => {
        // Redirect based on role
        if (userRole === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/billing");
        }
      }, 1500);
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      
      // Check for specific error messages
      if (error.message.toLowerCase().includes("invalid") || 
          error.message.toLowerCase().includes("incorrect") ||
          error.message.toLowerCase().includes("not found")) {
        errorMessage = "Invalid username or password.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setToast({ message: errorMessage, type: "error", duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
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
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-footer">
            <p className="footer-text">
              Don't have an account?{" "}
              <a href="/register" className="register-link">
                Register here
              </a>
            </p>
          </div>
        </div>

        <div className="login-decoration">
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

export default Login;
