import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

export default function MyOrders() {
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.data?.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-1">My Orders</h2>
      <p className="text-muted mb-4">
        Track your previous purchases and live shipment status
      </p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 my-4">
          <h5 className="fw-bold text-muted mb-3">
            You haven't placed any orders yet
          </h5>
          <Link to="/" className="btn btn-primary rounded-pill px-4">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="card border-0 shadow-sm rounded-4 p-4"
            >
              <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3 gap-2">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="badge bg-light text-dark border font-monospace">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-muted small">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span className="badge bg-light text-dark border">
                    {order.customer?.paymentMethod}
                  </span>
                  {order.trackingNumber && (
                    <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle font-monospace">
                      🚚 {order.trackingNumber}
                    </span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                    {order.status}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold"
                  >
                    Track Order &rarr;
                  </Link>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 mb-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex justify-content-between small"
                  >
                    <span>
                      <strong>{item.quantity}x</strong> {item.title}
                    </span>
                    <span className="text-muted">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="text-muted small">
                  Deliver to: {order.customer?.city}, {order.customer?.address}
                </span>
                <span className="fw-bold text-primary fs-5">
                  Total: ${Number(order.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
