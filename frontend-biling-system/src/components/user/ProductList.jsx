import React, { useState, useEffect } from "react";
import { getAllProducts, getProductsByCategory } from "../../services/productService";
import { getAllCategories } from "../../services/categoryService";
import "../styles/ProductList.css";

const ProductList = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when category changes or on mount
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedCategory) {
        data = await getProductsByCategory(selectedCategory);
      } else {
        data = await getAllProducts();
      }
      setProducts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="product-list-container">
      <div className="product-header">
        <h2>Available Products</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <h3>Filter by Category</h3>
        <div className="category-buttons">
          <button
            className={`category-btn ${!selectedCategory ? "active" : ""}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-category">
                    Category: {product.categoryId}
                  </p>
                </div>
                <div className="product-details">
                  <div className="price-stock">
                    <span className="price">₹{product.price}</span>
                    <span className="stock">
                      {product.quantity > 0 ? (
                        <span className="in-stock">In Stock ({product.quantity})</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </span>
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => onAddToCart(product)}
                    disabled={product.quantity <= 0}
                  >
                    {product.quantity > 0 ? "Add to Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
