import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/categories", label: "Categories", icon: "🏷️" },
    { path: "/admin/products", label: "Products", icon: "📦" },
    { path: "/admin/orders", label: "Orders", icon: "🛒" },
    { path: "/admin/invoices", label: "Invoices", icon: "🧾" },
    { path: "/admin/users", label: "Users", icon: "👥" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="admin-sidebar">
      <div className="sidebar-header">
        <h1 className="logo">Admin</h1>
      </div>

      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`menu-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
