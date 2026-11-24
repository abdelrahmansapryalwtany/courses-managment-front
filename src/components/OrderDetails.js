import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateOrderStatus } from "../rtk/slices/orders-slice";
import { Toast } from "../utils/toast";

export default function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [shipping, setShipping] = useState(false);

  const isStaff = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load order");
        setOrder(data.data.order);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [orderId, token]);

  if (!token) return <Navigate to="/login" replace />;

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === order.status && !statusNote.trim()) return;
    setUpdating(true);
    try {
      const updatedOrder = await dispatch(
        updateOrderStatus({
          orderId: order._id,
          status: newStatus,
          note: statusNote.trim(),
        }),
      ).unwrap();

      setOrder((prev) => ({
        ...prev,
        status: updatedOrder.status,
        statusHistory: updatedOrder.statusHistory,
      }));
      setStatusNote("");
      Toast.fire({
        icon: "success",
        title: `Order updated to ${newStatus}`,
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update order status",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateShipment = async () => {
    setShipping(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/${order._id}/ship`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create shipment");

      setOrder(data.data.order);
      Toast.fire({
        icon: "success",
        title: `Shipped! Tracking #: ${data.data.shipment.trackingNumber}`,
      });
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.message,
      });
    } finally {
      setShipping(false);
    }
  };

  const handleCopyTracking = () => {
    if (!order?.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    Toast.fire({
      icon: "success",
      title: "Tracking number copied!",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning-subtle text-warning-emphasis";
      case "Processing":
        return "bg-info-subtle text-info-emphasis";
      case "Shipped":
        return "bg-primary-subtle text-primary";
      case "Delivered":
        return "bg-success-subtle text-success";
      case "Cancelled":
        return "bg-danger-subtle text-danger";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="text-muted mt-2">Loading order details...</p>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="container py-5 text-center my-5">
        <h4 className="fw-bold text-danger mb-2">
          {errorMsg || "Order not found"}
        </h4>
        <Link
          to={isStaff ? "/admin/orders" : "/my-orders"}
          className="btn btn-primary rounded-pill px-4 mt-2"
        >
          &larr; Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-light text-dark border font-monospace">
              #{order._id.slice(-8).toUpperCase()}
            </span>
            <span
              className={`badge rounded-pill px-3 py-1 ${getStatusBadge(
                order.status,
              )}`}
            >
              {order.status}
            </span>
          </div>
          <h2 className="fw-bold mb-0">Order Details</h2>
          <small className="text-muted">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </small>
        </div>

        <Link
          to={isStaff ? "/admin/orders" : "/my-orders"}
          className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
        >
          &larr; Back to {isStaff ? "All Orders" : "My Orders"}
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {order.trackingNumber && (
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-primary-subtle border-start border-4 border-primary">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <div>
                  <span className="badge bg-primary rounded-pill mb-2">
                    🚚 Carrier Shipment Active
                  </span>
                  <h6 className="fw-bold text-dark mb-1">
                    Tracking Number:{" "}
                    <span className="font-monospace text-primary">
                      {order.trackingNumber}
                    </span>
                  </h6>
                  <p className="text-muted small mb-0">
                    Real-time carrier updates are automatically logged below via
                    Webhooks.
                  </p>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyTracking}
                    className="btn btn-sm btn-light border rounded-pill px-3 fw-semibold"
                  >
                    📋 Copy Code
                  </button>
                  {order.shippingLabelUrl && (
                    <a
                      href={order.shippingLabelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold"
                    >
                      📄 Shipping Label
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">
                Order Items ({order.items?.length || 0})
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3">Product</th>
                      <th className="py-3">Price</th>
                      <th className="py-3">Qty</th>
                      <th className="pe-4 py-3 text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {item.image ? (
                              <img
                                src={`${process.env.REACT_APP_API_URL}/uploads/${item.image}`}
                                alt={item.title}
                                className="border rounded-3 p-1 bg-white"
                                style={{
                                  width: "52px",
                                  height: "52px",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <div
                                className="border rounded-3 bg-light d-flex align-items-center justify-content-center text-muted small"
                                style={{ width: "52px", height: "52px" }}
                              >
                                📦
                              </div>
                            )}
                            <span className="fw-semibold text-dark">
                              {item.title}
                            </span>
                          </div>
                        </td>
                        <td>${Number(item.price).toFixed(2)}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="pe-4 text-end fw-bold text-primary">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4">🕒 Order Activity & Status History</h5>

            {!order.statusHistory || order.statusHistory.length === 0 ? (
              <p className="text-muted small mb-0">
                No history logs recorded for this order yet.
              </p>
            ) : (
              <div className="border-start border-2 border-primary ps-4 ms-2 d-flex flex-column gap-4">
                {[...order.statusHistory].reverse().map((entry, idx) => (
                  <div key={idx} className="position-relative">
                    <span
                      className="position-absolute bg-primary rounded-circle border border-3 border-white shadow-sm"
                      style={{
                        width: "16px",
                        height: "16px",
                        left: "-33px",
                        top: "4px",
                      }}
                    ></span>

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-1">
                      <span
                        className={`badge rounded-pill px-3 py-1 ${getStatusBadge(
                          entry.status,
                        )}`}
                      >
                        {entry.status}
                      </span>
                      <small className="text-muted">
                        {new Date(entry.updatedAt).toLocaleString()}
                      </small>
                    </div>

                    {entry.note && (
                      <div className="text-dark small fw-semibold mb-1">
                        {entry.note}
                      </div>
                    )}

                    <div className="text-muted small">
                      By:{" "}
                      <strong className="text-dark">{entry.updatedBy}</strong>{" "}
                      <span className="badge bg-light text-secondary border ms-1">
                        {entry.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-4 d-flex flex-column gap-4">
          {isStaff && (
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold mb-3">⚙️ Order Fulfillment & Status</h6>

              {!order.trackingNumber && order.status !== "Cancelled" && (
                <div className="mb-3 pb-3 border-bottom">
                  <button
                    type="button"
                    disabled={shipping}
                    onClick={handleCreateShipment}
                    className="btn btn-dark w-100 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2"
                  >
                    {shipping ? (
                      <>
                        <span className="spinner-border spinner-border-sm" />
                        Generating Label...
                      </>
                    ) : (
                      "🚚 Ship via EasyPost (Sandbox)"
                    )}
                  </button>
                  <small className="text-muted d-block text-center mt-1">
                    Generates tracking code & label PDF automatically
                  </small>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small text-muted fw-semibold">
                  Optional Note (recorded in history)
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="e.g. Handed over to courier..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>

              <div className="d-flex flex-wrap gap-2">
                {[
                  "Pending",
                  "Processing",
                  "Shipped",
                  "Delivered",
                  "Cancelled",
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={updating || order.status === st}
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                      order.status === st
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => handleStatusUpdate(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold mb-3">📍 Customer & Shipping</h6>
            <div className="d-flex flex-column gap-2 small">
              <div>
                <span className="text-muted">Name: </span>
                <strong className="text-dark">
                  {order.customer?.fullName}
                </strong>
                {order.user ? (
                  <span className="badge bg-info-subtle text-info-emphasis ms-2">
                    Member
                  </span>
                ) : (
                  <span className="badge bg-light text-muted border ms-2">
                    Guest
                  </span>
                )}
              </div>
              <div>
                <span className="text-muted">Phone: </span>
                <strong className="text-dark">{order.customer?.phone}</strong>
              </div>
              <div>
                <span className="text-muted">City: </span>
                <span className="text-dark">{order.customer?.city}</span>
              </div>
              <div>
                <span className="text-muted">Address: </span>
                <span className="text-dark">{order.customer?.address}</span>
              </div>
              {order.customer?.notes && (
                <div className="alert alert-warning py-2 px-3 mt-2 mb-0 small">
                  <strong>Note:</strong> {order.customer.notes}
                </div>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold mb-3">💳 Payment Summary</h6>
            <div className="d-flex justify-content-between align-items-center mb-2 small">
              <span className="text-muted">Method</span>
              {order.customer?.paymentMethod === "STRIPE" ? (
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  💳 Stripe (Paid)
                </span>
              ) : (
                <span className="badge bg-secondary-subtle text-secondary">
                  💵 Cash on Delivery
                </span>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3 small">
              <span className="text-muted">Shipping</span>
              <span className="text-success fw-semibold">Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Total Amount</span>
              <span className="fw-bold fs-5 text-primary">
                ${Number(order.totalPrice).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
