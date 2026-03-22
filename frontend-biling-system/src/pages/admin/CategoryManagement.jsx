import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import "./CategoryManagement.css";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllCategories();
      console.log("Categories loaded:", data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError(`Failed to load categories: ${err.message}`);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (editingId) {
        await updateCategory(editingId, form);
        setEditingId(null);
      } else {
        await createCategory(form);
      }
      setForm({ name: "", description: "" });
      loadCategories();
    } catch (err) {
      setError(editingId ? "Failed to update category" : "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description });
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", description: "" });
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      setLoading(true);
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      setError("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="management-container">
        {/* Header */}
        <div className="management-header">
          <h1>🏷️ Category Management</h1>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Form Card */}
        <div className="form-card">
          <h2>{editingId ? "✏️ Edit Category" : "➕ Add New Category"}</h2>
          <form onSubmit={handleSubmit} className="management-form">
            <div className="form-group">
              <label>Category Name *</label>
              <input
                type="text"
                placeholder="e.g., Electronics, Clothing, etc."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input"
                disabled={loading}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Category description (optional)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="form-input"
                disabled={loading}
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Processing..." : (editingId ? "💾 Update" : "➕ Add")}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Grid */}
        <div className="list-card">
          <div className="list-header">
            <h2>All Categories ({categories.length})</h2>
            {loading && <span className="loading-spinner">Loading...</span>}
          </div>

          {categories.length === 0 ? (
            <div className="empty-state">
              <p>🏷️ No categories found. Create one to get started!</p>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((c) => (
                <div key={c.id} className="category-card">
                  <div className="card-body">
                    <h3>{c.name}</h3>
                  </div>
                  <div className="card-footer">
                    <button
                      onClick={() => handleEdit(c)}
                      className="btn-icon edit-btn"
                      title="Edit"
                      disabled={loading}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="btn-icon delete-btn"
                      title="Delete"
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;
