import React from "react";
import "../styles/CartItem.css";

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      onUpdateQuantity(item.productId || item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      onRemoveItem(item.productId || item.id);
    }
  };

  const itemTotal = (item.price || 0) * (item.quantity || 1);

  return (
    <div className="cart-item">
      <div className="item-image">
        <div className="image-placeholder">
          {item.name?.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="item-details">
        <h4 className="item-name">{item.name}</h4>
        <p className="item-description">{item.description}</p>
      </div>

      <div className="item-price">
        <span className="price">₹{item.price}</span>
      </div>

      <div className="item-quantity">
        <input
          type="number"
          min="1"
          value={item.quantity || 1}
          onChange={handleQuantityChange}
          className="quantity-input"
          aria-label="Quantity"
        />
      </div>

      <div className="item-total">
        <span className="total-price">₹{itemTotal.toFixed(2)}</span>
      </div>

      <button
        className="remove-btn"
        onClick={handleRemove}
        title="Remove item from cart"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
