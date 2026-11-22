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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Slider /> <ProductList />
            </>
          }
        />
        <Route path="cart" element={<Cart />} />
        <Route path="about" element={<About />} />
        <Route path="product/:productId" element={<ProductDetails />} />
        <Route path="admin" element={<Admin />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="edit-product/:productId" element={<EditProduct />} />
      </Routes>
    </>
  );
}

export default App;
