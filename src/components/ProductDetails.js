import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSingleProduct,
  clearSelectedProduct,
} from "../rtk/slices/products-slice";
import { addToCart } from "../rtk/slices/cart-slice";

function ProductDetails() {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct: product, loading } = useSelector(
    (state) => state.products,
  );
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchSingleProduct(productId));

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId]);

  const cartItem = cart.find((item) => item._id === product?._id);

  if (loading || !product) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Breadcrumb / Back Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              Home
            </Link>
          </li>
          <li className="breadcrumb-item text-capitalize">
            {product.category || "Products"}
          </li>
          <li
            className="breadcrumb-item active text-truncate"
            style={{ maxWidth: "250px" }}
            aria-current="page"
          >
            {product.title}
          </li>
        </ol>
      </nav>

      {/* Main Product Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="row g-0 align-items-center">
          {/* Product Image Column */}
          <div className="col-md-6 bg-light p-4 p-lg-5 text-center border-end">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
              alt={product.title}
              className="img-fluid rounded-3"
              style={{
                maxHeight: "420px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Product Details Column */}
          <div className="col-md-6 p-4 p-lg-5">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3 fw-semibold text-capitalize">
              {product.category || "General"}
            </span>

            <h1 className="fw-bold display-6 mb-3">{product.title}</h1>

            <h2 className="fw-bold text-primary mb-4">
              ${Number(product.price || 0).toFixed(2)}
            </h2>

            <p className="text-muted fs-6 lh-lg mb-4">{product.description}</p>

            <hr className="my-4" />

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-3">
              <button
                className="btn btn-primary btn-lg px-4 py-2 rounded-pill fw-semibold flex-grow-1"
                onClick={() => dispatch(addToCart(product))}
              >
                🛒 Add to Cart {cartItem ? `(${cartItem.quantity})` : ""}
              </button>

              <Link
                to="/"
                className="btn btn-outline-secondary btn-lg px-4 py-2 rounded-pill fw-semibold"
              >
                &larr; Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
