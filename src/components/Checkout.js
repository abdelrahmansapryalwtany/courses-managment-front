import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { clear } from "../rtk/slices/cart-slice";

function Checkout() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
    paymentMethod: "COD", // COD أو STRIPE
  });

  const [submitting, setSubmitting] = useState(false);

  const totalPrice = cart.reduce((acc, item) => {
    return acc + Number(item.price) * (item.quantity || 1);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <h3 className="fw-bold mb-3">No items to checkout</h3>
        <Link to="/" className="btn btn-primary rounded-pill px-4">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderData = {
      customer,
      items: cart.map((item) => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      totalPrice,
    };

    try {
      // 1. في حالة الدفع عبر Stripe
      if (customer.paymentMethod === "STRIPE") {
        localStorage.setItem("pendingOrder", JSON.stringify(orderData));

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/orders/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          },
        );

        const data = await res.json();

        if (!res.ok || !data.url) {
          throw new Error(data.message || "Failed to initialize payment");
        }

        window.location.href = data.url;
        return;
      }

      // 2. في حالة الدفع عند الاستلام (COD)
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      dispatch(clear());

      await Swal.fire({
        icon: "success",
        title: "Order Placed Successfully!",
        text: "Thank you for your purchase. We will contact you soon.",
        confirmButtonColor: "#0d6efd",
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: error.message || "Something went wrong, please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Checkout</h2>
        <p className="text-muted">
          Complete your shipping details to place the order
        </p>
      </div>

      <div className="row g-4">
        {/* فورم بيانات الشحن */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4">
            <h5 className="fw-bold mb-4">Shipping Information</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={customer.fullName}
                  onChange={(e) =>
                    setCustomer({ ...customer, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="01xxxxxxxxx"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">City</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Cairo, Alexandria"
                    value={customer.city}
                    onChange={(e) =>
                      setCustomer({ ...customer, city: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Detailed Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Street name, building, apartment..."
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Order Notes (Optional)
                </label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Any special delivery instructions?"
                  value={customer.notes}
                  onChange={(e) =>
                    setCustomer({ ...customer, notes: e.target.value })
                  }
                />
              </div>

              {/* خيارات الدفع */}
              <h6 className="fw-bold mb-2">Payment Method</h6>
              <div className="bg-light p-3 rounded-3 mb-4 border d-flex flex-column gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    checked={customer.paymentMethod === "COD"}
                    onChange={() =>
                      setCustomer({ ...customer, paymentMethod: "COD" })
                    }
                  />
                  <label className="form-check-label fw-semibold" htmlFor="cod">
                    💵 Cash on Delivery (COD)
                  </label>
                  <div className="text-muted small">
                    Pay in cash when your order is delivered to your doorstep.
                  </div>
                </div>

                <hr className="my-0" />

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="stripe"
                    checked={customer.paymentMethod === "STRIPE"}
                    onChange={() =>
                      setCustomer({ ...customer, paymentMethod: "STRIPE" })
                    }
                  />
                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="stripe"
                  >
                    💳 Credit / Debit Card (Stripe)
                  </label>
                  <div className="text-muted small">
                    Secure online payment powered by Stripe (Test Mode).
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 rounded-pill fw-bold fs-6"
                disabled={submitting}
              >
                {submitting
                  ? "Processing..."
                  : customer.paymentMethod === "STRIPE"
                    ? `Pay Now ($${totalPrice.toFixed(2)})`
                    : `Confirm Order ($${totalPrice.toFixed(2)})`}
              </button>
            </form>
          </div>
        </div>

        {/* ملخص الطلب */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
            <h5 className="fw-bold mb-4">Your Order ({cart.length} items)</h5>

            <div className="d-flex flex-column gap-3 mb-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between align-items-center border-bottom pb-2"
                >
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                      alt={item.title}
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "contain",
                      }}
                      className="border rounded p-1"
                    />
                    <div>
                      <div className="fw-semibold small">{item.title}</div>
                      <small className="text-muted">
                        Qty: {item.quantity || 1}
                      </small>
                    </div>
                  </div>
                  <span className="fw-bold small">
                    ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mb-2 text-muted">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Shipping</span>
              <span className="text-success fw-semibold">Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold fs-5">Total</span>
              <span className="fw-bold fs-5 text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
