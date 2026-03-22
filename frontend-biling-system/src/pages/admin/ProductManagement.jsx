import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getAllProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import "./ProductManagement.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    loadProducts();
  }, [categoryFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      let productsData;
      if (categoryFilter) {
        productsData = await getProductsByCategory(categoryFilter);
      } else {
        productsData = await getAllProducts();
      }
      setProducts(Array.isArray(productsData) ? productsData : []);
      const categoriesData = await getAllCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.quantity || !form.categoryId) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      if (editingId) {
        await updateProduct(editingId, form);
        setEditingId(null);
      } else {
        await createProduct(form);
      }
      setForm({ name: "", price: "", quantity: "", categoryId: "" });
      loadProducts();
    } catch (err) {
      setError(editingId ? "Failed to update product" : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.categoryId,
    });
    setError("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", price: "", quantity: "", categoryId: "" });
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setLoading(true);
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="management-container">
        {/* Header */}
        <div className="management-header">
          <h1>📦 Product Management</h1>
        </div>

        {/* Error Alert */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Form Card */}
        <div className="form-card">
          <h2>{editingId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Laptop, Phone, etc."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="form-input"
                  disabled={loading}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="form-input"
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="form-input"
                  disabled={loading}
                  required
                />
              </div>
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

        {/* Filter Section */}
        <div className="filter-card">
          <h3>🔍 Filter by Category</h3>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
            disabled={loading}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div className="list-card">
          <div className="list-header">
            <h2>All Products ({products.length})</h2>
            {loading && <span className="loading-spinner">Loading...</span>}
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <p>📦 No products found. Create one to get started!</p>
            </div>
          ) : (
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Stock Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const category = categories.find((c) => c.id === p.categoryId);
                    const categoryName = p.categoryName || category?.name || "N/A";
                    const stockStatus = p.quantity > 10 ? "In Stock" : p.quantity > 0 ? "Low Stock" : "Out of Stock";
                    const stockClass = stockStatus === "In Stock" ? "status-success" : stockStatus === "Low Stock" ? "status-warning" : "status-danger";
                    
                    return (
                      <tr key={p.id}>
                        <td className="product-name">{p.name}</td>
                        <td>{categoryName}</td>
                        <td className="price">{parseFloat(p.price).toFixed(2)}</td>
                        <td className="quantity">{p.quantity}</td>
                        <td>
                          <span className={`status-badge ${stockClass}`}>
                            {stockStatus}
                          </span>
                        </td>
                        <td className="actions">
                          <button
                            onClick={() => handleEdit(p)}
                            className="btn-icon edit-btn"
                            title="Edit"
                            disabled={loading}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="btn-icon delete-btn"
                            title="Delete"
                            disabled={loading}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;
