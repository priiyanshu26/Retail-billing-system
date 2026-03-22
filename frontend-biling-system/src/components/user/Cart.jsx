// import React, { useState, useEffect } from "react";
// import CartItem from "./CartItem";
// import { createOrder, addItemToOrder } from "../../services/orderService";
// import { useAuth } from "../../context/AuthContext";
// import "../styles/Cart.css";

// const Cart = ({ items, onItemsChange, onCheckout }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [orderId, setOrderId] = useState(null);
//   const { username } = useAuth();

//   const calculateSubtotal = () => {
//     return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
//   };

//   const calculateTax = () => {
//     return calculateSubtotal() * 0.18; // 18% GST
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + calculateTax();
//   };

//   const handleUpdateQuantity = (productId, newQuantity) => {
//     const updatedItems = items.map((item) =>
//       (item.productId || item.id) === productId
//         ? { ...item, quantity: newQuantity }
//         : item
//     );
//     onItemsChange(updatedItems);
//   };

//   const handleRemoveItem = (productId) => {
//     const updatedItems = items.filter(
//       (item) => (item.productId || item.id) !== productId
//     );
//     onItemsChange(updatedItems);
//   };

//   const handleCreateOrder = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       if (!username) {
//         setError("User information not available");
//         return;
//       }

//       // Create order
//       const order = await createOrder(username);
//       setOrderId(order.id);

//       // Add items to order
//       for (const item of items) {
//         await addItemToOrder(order.id, {
//           productId: item.productId || item.id,
//           quantity: item.quantity || 1,
//         });
//       }

//       // Proceed to checkout
//       if (onCheckout) {
//         onCheckout(order.id, calculateTotal());
//       }
//     } catch (err) {
//       setError(err.message || "Failed to create order");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (items.length === 0) {
//     return (
//       <div className="cart-empty">
//         <div className="empty-illustration">🛒</div>
//         <h2>Your cart is empty</h2>
//         <p>Add products to get started!</p>
//       </div>
//     );
//   }

//   const subtotal = calculateSubtotal();
//   const tax = calculateTax();
//   const total = calculateTotal();

//   return (
//     <div className="cart-container">
//       <div className="cart-content">
//         <h2 className="cart-title">Shopping Cart</h2>

//         {error && <div className="error-alert">{error}</div>}

//         <div className="cart-items">
//           {items.map((item) => (
//             <CartItem
//               key={item.productId || item.id}
//               item={item}
//               onUpdateQuantity={handleUpdateQuantity}
//               onRemoveItem={handleRemoveItem}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="cart-summary">
//         <h3>Order Summary</h3>

//         <div className="summary-row">
//           <span>Subtotal</span>
//           <span>₹{subtotal.toFixed(2)}</span>
//         </div>

//         <div className="summary-row">
//           <span>GST (18%)</span>
//           <span>₹{tax.toFixed(2)}</span>
//         </div>

//         <div className="summary-divider"></div>

//         <div className="summary-row total">
//           <span>Total</span>
//           <span>₹{total.toFixed(2)}</span>
//         </div>

//         <div className="summary-info">
//           <p>Items in cart: {items.length}</p>
//         </div>

//         <button
//           className="checkout-btn"
//           onClick={handleCreateOrder}
//           disabled={loading || items.length === 0}
//         >
//           {loading ? "Creating Order..." : "Proceed to Checkout"}
//         </button>

//         {orderId && (
//           <div className="order-created">
//             ✓ Order #{orderId} created successfully!
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;

import React from "react";
import CartItem from "./CartItem";
import "../styles/Cart.css";

const Cart = ({ items, onItemsChange, onCheckout, loading = false }) => {
  const calculateSubtotal = () =>
    items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

  const calculateTax = () => calculateSubtotal() * 0.18;

  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleUpdateQuantity = (productId, quantity) => {
    const updated = items.map((item) =>
      (item.id === productId || item.productId === productId)
        ? { ...item, quantity }
        : item
    );
    onItemsChange(updated);
  };

  const handleRemoveItem = (productId) => {
    const updated = items.filter(
      (item) => (item.id !== productId && item.productId !== productId)
    );
    onItemsChange(updated);
  };

  const handleCheckoutClick = async () => {
    if (onCheckout && typeof onCheckout === "function") {
      await onCheckout();
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h3>🛒 Cart is empty</h3>
        <p>Add products to continue</p>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const total = calculateTotal();

  return (
    <div className="cart-container">
      <h3>Cart</h3>

      {items.map((item) => (
        <CartItem
          key={item.id || item.productId}
          item={item}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      ))}

      <hr />

      <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
      <p>GST (18%): ₹{tax.toFixed(2)}</p>
      <h4>Total: ₹{total.toFixed(2)}</h4>

      <button 
        onClick={handleCheckoutClick}
        disabled={loading || items.length === 0}
      >
        {loading ? "Processing..." : "Proceed to Checkout"}
      </button>
    </div>
  );
};

export default Cart;
