import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Slider from "./components/Slider";
import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import ProductDetails from "./components/ProductDetails";
import Admin from "./components/Admin";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import AdminOrders from "./components/AdminOrders";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Wishlist from "./components/Wishlist";
import PaymentSuccess from "./components/PaymentSuccess";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Slider />
                <ProductList />
              </>
            }
          />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="about" element={<About />} />
          <Route path="product/:productId" element={<ProductDetails />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-product/:productId"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
