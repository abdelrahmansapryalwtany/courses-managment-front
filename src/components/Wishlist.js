import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleWishlist, clearWishlist } from "../rtk/slices/wishlist-slice";
import { addToCart } from "../rtk/slices/cart-slice";
import { Toast } from "../utils/toast";

export default function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  if (wishlist.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="mb-3 display-1">🤍</div>
        <h3 className="fw-bold mb-2">Your Wishlist is Empty</h3>
        <p className="text-muted mb-4">
          Save items you love here to easily find and buy them later.
        </p>
        <Link
          to="/"
          className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          My Wishlist{" "}
          <span className="text-muted fs-5">({wishlist.length} items)</span>
        </h2>
        <button
          className="btn btn-outline-danger btn-sm px-3 rounded-pill"
          onClick={() => dispatch(clearWishlist())}
        >
          Clear All
        </button>
      </div>

      <div className="row g-4">
        {wishlist.map((product) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product._id}>
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="position-relative bg-light p-3 text-center">
                <button
                  type="button"
                  className="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow-sm border"
                  style={{ width: "36px", height: "36px" }}
                  title="Remove"
                  onClick={() => dispatch(toggleWishlist(product))}
                >
                  ❌
                </button>

                <Link to={`/product/${product._id}`}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
                    alt={product.title}
                    style={{ height: "190px", objectFit: "contain" }}
                  />
                </Link>
              </div>

              <div className="card-body d-flex flex-column p-4">
                <h6
                  className="fw-bold text-truncate mb-2"
                  title={product.title}
                >
                  {product.title}
                </h6>
                <h5 className="fw-bold text-primary mb-3">
                  ${Number(product.price).toFixed(2)}
                </h5>

                <button
                  className="btn btn-primary rounded-pill fw-semibold mt-auto w-100"
                  onClick={() => {
                    dispatch(addToCart(product));
                    Toast.fire({ icon: "success", title: "Moved to cart!" });
                  }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
