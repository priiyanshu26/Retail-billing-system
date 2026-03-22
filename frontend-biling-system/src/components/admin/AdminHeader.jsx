import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../common/ConfirmDialog";
import Toast from "../common/Toast";
import "./AdminHeader.css";

const AdminHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const handleLogout = () => {
    setLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setLogoutConfirm(false);
    logout();
    setToast({ message: "You have been logged out successfully", type: "info", duration: 2000 });
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <header className="admin-header">
        <div className="header-left">
          <h2>Admin Dashboard</h2>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <span className="user-name">Admin</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={logoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access the admin panel."
        onConfirm={confirmLogout}
        onCancel={() => setLogoutConfirm(false)}
        confirmText="Log Out"
        cancelText="Cancel"
        isDangerous={true}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default AdminHeader;