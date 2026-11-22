import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// 1. هنا ضفنا addToCart و decreaseQuantity
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  clear,
} from "../rtk/slices/cart-slice";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cart.reduce((acc, product) => {
    const qty = product.quantity || 1;
    return acc + Number(product.price) * qty;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="mb-3 display-1">🛒</div>
        <h3 className="fw-bold mb-2">Your Cart is Empty</h3>
        <p className="text-muted mb-4">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/" className="btn btn-primary px-4 py-2 rounded-pill">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          Shopping Cart{" "}
          <span className="text-muted fs-5">({cart.length} items)</span>
        </h2>
        <button
          className="btn btn-outline-danger btn-sm px-3"
          onClick={() => dispatch(clear())}
        >
          Clear Cart
        </button>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3">Product</th>
                      <th className="py-3">Price</th>
                      <th className="py-3">Quantity</th>
                      <th className="py-3">Total</th>
                      <th className="pe-4 py-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((product) => {
                      const qty = product.quantity || 1;
                      return (
                        <tr key={product._id}>
                          {/* صورة واسم المنتج */}
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
                                alt={product.title}
                                style={{
                                  width: "65px",
                                  height: "65px",
                                  objectFit: "contain",
                                }}
                                className="border rounded p-1 bg-white"
                              />
                              <div>
                                <h6 className="mb-0 fw-semibold">
                                  {product.title}
                                </h6>
                                <small className="text-muted">
                                  {product.category || "General"}
                                </small>
                              </div>
                            </div>
                          </td>

                          {/* سعر القطعة */}
                          <td>${Number(product.price).toFixed(2)}</td>

                          {/* 2. هنا حطينا زرارين + و - مكان الرقم الثابت */}
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary px-2"
                                onClick={() =>
                                  dispatch(decreaseQuantity(product))
                                }
                              >
                                -
                              </button>
                              <span className="fw-bold px-2">{qty}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary px-2"
                                onClick={() => dispatch(addToCart(product))}
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* إجمالي المنتج */}
                          <td className="fw-bold text-primary">
                            ${(Number(product.price) * qty).toFixed(2)}
                          </td>

                          {/* زرار الحذف */}
                          <td className="pe-4 text-end">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => dispatch(deleteFromCart(product))}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ملخص الفاتورة */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-3">
            <div className="card-body">
              <h5 className="fw-bold mb-4">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Shipping</span>
                <span className="text-success fw-semibold">Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-5 text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="btn btn-primary w-100 py-2 fw-semibold mb-2"
              >
                Proceed to Checkout
              </Link>

              <Link to="/" className="btn btn-outline-secondary w-100 py-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
