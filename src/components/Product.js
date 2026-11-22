import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../rtk/slices/cart-slice";
import { Toast } from "../utils/toast";
import { toggleWishlist } from "../rtk/slices/wishlist-slice";

export default function Product(props) {
  const { product, showButton } = props;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist);
  const isFavorite = wishlist.some((item) => item._id === product._id);

  // معرفة هل المنتج مضاف للسلة وكميته الحالية
  const cartItem = cart.find((item) => item._id === product._id);

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      {/* حاوية الصورة بخلفية هادئة */}
      <div className="position-relative bg-light p-3 text-center">
        <button
          type="button"
          className="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-3 shadow-sm border"
          style={{ width: "36px", height: "36px", zIndex: 2 }}
          title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          onClick={() => {
            dispatch(toggleWishlist(product));
            Toast.fire({
              icon: isFavorite ? "info" : "success",
              title: isFavorite
                ? "Removed from wishlist"
                : "Added to wishlist!",
            });
          }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        {product.category && (
          <span className="badge bg-white text-secondary border rounded-pill position-absolute top-0 start-0 m-3 px-2 py-1 text-capitalize shadow-sm">
            {product.category}
          </span>
        )}

        {showButton ? (
          <Link to={`/product/${product._id}`}>
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
              className="card-img-top"
              alt={product.title}
              style={{
                height: "200px",
                objectFit: "contain",
                cursor: "pointer",
              }}
            />
          </Link>
        ) : (
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
            className="card-img-top"
            alt={product.title}
            style={{
              height: "200px",
              objectFit: "contain",
            }}
          />
        )}
      </div>

      {/* محتوى الكارت */}
      <div className="card-body d-flex flex-column p-4">
        <h5
          className="card-title fw-bold text-dark text-truncate mb-2"
          title={product.title}
        >
          {product.title}
        </h5>

        <p
          className="card-text text-muted small mb-3"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </p>

        {/* السعر والأزرار في الأسفل دائماً */}
        <div className="mt-auto pt-2 border-top">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">Price</span>
            <h5 className="fw-bold text-primary mb-0">
              ${Number(product.price).toFixed(2)}
            </h5>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary rounded-pill fw-semibold flex-fill"
              onClick={() => {
                dispatch(addToCart(product));
                Toast.fire({
                  icon: "success",
                  title: "Added to cart!",
                });
              }}
            >
              🛒 Add {cartItem ? `(${cartItem.quantity})` : ""}
            </button>

            {showButton && (
              <Link
                to={`/product/${product._id}`}
                className="btn btn-outline-secondary rounded-pill fw-semibold px-3"
              >
                Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
