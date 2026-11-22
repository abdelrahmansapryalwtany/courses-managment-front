import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { clear } from "../rtk/slices/cart-slice";

export default function PaymentSuccess() {
  const dispatch = useDispatch();
  const hasSaved = useRef(false); // لمنع تكرار حفظ الطلب مرتين في React StrictMode

  useEffect(() => {
    const saveOrder = async () => {
      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
      if (!pendingOrder || hasSaved.current) return;
      hasSaved.current = true;

      try {
        await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingOrder),
        });
        localStorage.removeItem("pendingOrder");
        dispatch(clear());
      } catch (error) {
        console.error("Failed to save order after payment:", error);
      }
    };

    saveOrder();
  }, [dispatch]);

  return (
    <div className="container py-5 text-center my-5">
      <div className="display-1 text-success mb-3">✅</div>
      <h2 className="fw-bold mb-2">Payment Successful!</h2>
      <p className="text-muted mb-4">
        Your payment was processed and your order has been confirmed.
      </p>
      <Link
        to="/"
        className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
