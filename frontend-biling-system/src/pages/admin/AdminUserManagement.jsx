import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllUsers, getUserById, deleteUser } from "../../services/userService";
import "./AdminUserManagement.css";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      setLoadingDetails(true);
      setError(null);
      const userDetail = await getUserById(userId);
      setUserDetails(userDetail);
      setSelectedUser(userId);
      setShowDetails(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.message || "Failed to fetch user details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setShowDetails(false);
      setUserDetails(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setUserDetails(null);
    setSelectedUser(null);
  };

  return (
    <AdminLayout>
      <div className="management-container">
        {/* Header */}
        <div className="management-header">
          <h1>👥 User Management</h1>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-small">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-small">
            <span className="stat-label">Active Users</span>
            <span className="stat-value">{users.filter(u => u.enabled).length}</span>
          </div>
          <div className="stat-small">
            <span className="stat-label">Inactive Users</span>
            <span className="stat-value">{users.filter(u => !u.enabled).length}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Refresh Button */}
        <div className="action-bar">
          <button onClick={fetchUsers} className="btn btn-primary" disabled={loading}>
            {loading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>

        {/* Users List */}
        <div className="list-card">
          <div className="list-header">
            <h2>All Users</h2>
            {loading && <span className="loading-spinner">Loading...</span>}
          </div>

          {users.length === 0 ? (
            <div className="empty-state">
              <p>👥 No users found.</p>
            </div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Roles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="user-id">{user.id}</td>
                      <td className="username">{user.username}</td>
                      <td>
                        <span className={`status-badge ${user.enabled ? "status-active" : "status-inactive"}`}>
                          {user.enabled ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="roles-container">
                          {user.roles && user.roles.map((role, idx) => (
                            <span key={idx} className="role-badge">
                              {role.replace("ROLE_", "")}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="actions">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="btn-icon view-btn"
                          title="View Details"
                          disabled={loading}
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn-icon delete-btn"
                          title="Delete User"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showDetails && userDetails && (
          <div className="modal-overlay" onClick={closeDetails}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>User Details</h2>
                <button onClick={closeDetails} className="close-btn" title="Close">
                  ✕
                </button>
              </div>

              {loadingDetails ? (
                <div className="modal-body">
                  <p className="loading-text">Loading user details...</p>
                </div>
              ) : (
                <div className="modal-body">
                  <div className="detail-row">
                    <label className="detail-label">User ID:</label>
                    <span className="detail-value">{userDetails.id}</span>
                  </div>
                  <div className="detail-row">
                    <label className="detail-label">Username:</label>
                    <span className="detail-value">{userDetails.username}</span>
                  </div>
                  <div className="detail-row">
                    <label className="detail-label">Status:</label>
                    <span className={`status-badge ${userDetails.enabled ? "status-active" : "status-inactive"}`}>
                      {userDetails.enabled ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label className="detail-label">Roles:</label>
                    <div className="roles-container">
                      {userDetails.roles && userDetails.roles.map((role, idx) => (
                        <span key={idx} className="role-badge">
                          {role.replace("ROLE_", "")}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      onClick={() => handleDeleteUser(selectedUser)}
                      className="btn btn-danger"
                    >
                      🗑️ Delete User
                    </button>
                    <button onClick={closeDetails} className="btn btn-secondary">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;
