// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
// import ProtectedRoute from "../components/common/ProtectedRoute";
// import AdminDashboard from "../pages/admin/AdminDashboard";
// import CategoryManagement from "../pages/admin/CategoryManagement";
// import ProductManagement from "../pages/admin/ProductManagement";
// import OrderManagement from "../pages/admin/OrderManagement";

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/login" />} />

//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/categories"
//         element={
//           <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
//             <CategoryManagement />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/products"
//         element={
//           <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
//             <ProductManagement />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/orders"
//         element={
//           <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
//             <OrderManagement />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/billing"
//         element={
//           <ProtectedRoute allowedRoles={["ROLE_USER"]}>
//             <h1>Billing Screen (Phase 3)</h1>
//           </ProtectedRoute>
//         }
//       />

//       <Route path="*" element={<Navigate to="/login" />} />
//     </Routes>
//   );
// }

// export default AppRoutes;



import { Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import CategoryManagement from "../pages/admin/CategoryManagement";
import ProductManagement from "../pages/admin/ProductManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import AdminInvoices from "../pages/admin/AdminInvoices";
import AdminUserManagement from "../pages/admin/AdminUserManagement";

// User pages (Phase 3)
import BillingScreen from "../pages/user/BillingScreen";
import OrderHistory from "../pages/user/OrderHistory";
import OrderDetails from "../pages/user/OrderDetails";
import PaymentSuccess from "../pages/user/PaymentSuccess";
import PaymentFailure from "../pages/user/PaymentFailure";
import UserProfile from "../pages/user/UserProfile";
import InvoicesHistory from "../pages/user/InvoicesHistory";

// Security
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <CategoryManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <ProductManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <OrderManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/invoices"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminInvoices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminUserManagement />
          </ProtectedRoute>
        }
      />

      {/* ================= USER / POS ROUTES ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <BillingScreen />
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <BillingScreen />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <OrderHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/success"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/failure"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <PaymentFailure />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <InvoicesHistory />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;
