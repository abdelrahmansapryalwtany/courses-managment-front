import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../rtk/slices/orders-slice";
import { Toast } from "../utils/toast";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [phoneFilter, setPhoneFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, phoneFilter, searchQuery, ordersPerPage]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus }),
      ).unwrap();
      Toast.fire({
        icon: "success",
        title: `Order updated to ${newStatus}`,
      });
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to update status",
      });
    }
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

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    const matchesPhone = !phoneFilter || order.customer?.phone === phoneFilter;
    const matchesSearch =
      !searchQuery ||
      order.customer?.fullName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.customer?.phone?.includes(searchQuery);

    return matchesStatus && matchesPhone && matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const statuses = [
    "ALL",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
            ADMIN PANEL
          </span>
          <h2 className="fw-bold mb-1">
            Customer Orders ({filteredOrders.length})
          </h2>
          <p className="text-muted mb-0">
            Track payments, customer history, and delivery status
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control rounded-pill px-4 bg-light border-0"
                placeholder="🔍 Search by customer name or phone number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="col-md-4 d-flex justify-content-md-end">
              <div className="d-flex align-items-center gap-2 bg-light px-3 py-2 rounded-pill">
                <label
                  htmlFor="ordersLimit"
                  className="text-muted small fw-semibold text-nowrap mb-0"
                >
                  Rows per page:
                </label>
                <select
                  id="ordersLimit"
                  className="form-select form-select-sm border-0 bg-transparent fw-bold shadow-none w-auto py-0"
                  value={ordersPerPage}
                  onChange={(e) => setOrdersPerPage(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div className="d-flex flex-wrap gap-2">
              {statuses.map((st) => (
                <button
                  key={st}
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                    statusFilter === st ? "btn-primary" : "btn-light text-dark"
                  }`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st === "ALL" ? "All Orders" : st}
                </button>
              ))}
            </div>

            {phoneFilter && (
              <div className="d-flex align-items-center gap-2 bg-primary-subtle text-primary px-3 py-1 rounded-pill small fw-semibold">
                <span>Showing history for: {phoneFilter}</span>
                <button
                  type="button"
                  className="btn-close btn-close-sm"
                  aria-label="Clear filter"
                  onClick={() => setPhoneFilter(null)}
                ></button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading orders...</p>
            </div>
          ) : currentOrders.length === 0 ? (
            <div className="text-center py-5 my-4">
              <h5 className="fw-bold text-muted">No matching orders found</h5>
              <p className="text-muted small mb-0">
                Try clearing filters or wait for new customer orders.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 py-3">Customer</th>
                    <th className="py-3">Address & Notes</th>
                    <th className="py-3">Items</th>
                    <th className="py-3">Payment</th>
                    <th className="py-3">Total</th>
                    <th className="py-3">Date</th>
                    <th className="pe-5 py-3">Status & Tracking</th>
                    <th className="pe-5 py-3 text-end">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="ps-4 py-3">
                        <div className="fw-bold text-dark mb-1 text-nowrap">
                          {order.customer?.fullName}
                        </div>

                        <div className="d-flex align-items-center gap-2 text-nowrap">
                          <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none small text-primary"
                            title="Click to view all orders by this phone number"
                            onClick={() =>
                              setPhoneFilter(order.customer?.phone)
                            }
                          >
                            📞 {order.customer?.phone}
                          </button>

                          {order.user ? (
                            <span
                              className="badge bg-info-subtle text-info-emphasis rounded-pill"
                              title="Registered User"
                            >
                              Member
                            </span>
                          ) : (
                            <span
                              className="badge bg-light text-muted border rounded-pill"
                              title="Guest Checkout"
                            >
                              Guest
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="small fw-semibold">
                          {order.customer?.city}
                        </div>
                        <div
                          className="text-muted small text-truncate"
                          style={{ maxWidth: "180px" }}
                          title={order.customer?.address}
                        >
                          {order.customer?.address}
                        </div>
                        {order.customer?.notes && (
                          <div
                            className="text-warning-emphasis small mt-1 text-truncate"
                            style={{ maxWidth: "180px" }}
                            title={order.customer?.notes}
                          >
                            📝 {order.customer?.notes}
                          </div>
                        )}
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-1">
                          {order.items?.map((item, idx) => (
                            <span key={idx} className="small">
                              <span className="badge bg-light text-dark border me-1">
                                {item.quantity}x
                              </span>
                              {item.title}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        {order.customer?.paymentMethod === "STRIPE" ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                            💳 Stripe (Paid)
                          </span>
                        ) : (
                          <span className="badge bg-secondary-subtle text-secondary px-2 py-1">
                            💵 COD
                          </span>
                        )}
                      </td>

                      <td>
                        <span className="fw-bold text-primary">
                          ${Number(order.totalPrice).toFixed(2)}
                        </span>
                      </td>

                      <td className="text-muted small">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="pe-4 text-end">
                        <select
                          className={`form-select form-select-sm d-inline-block w-auto fw-semibold rounded-pill border-0 ps-3 pe-5 ${getStatusBadge(
                            order.status,
                          )}`}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        {order.trackingNumber && (
                          <div className="small text-primary font-monospace mt-1">
                            🚚 {order.trackingNumber}
                          </div>
                        )}
                      </td>
                      <td className="pe-4 text-end">
                        <Link
                          to={`/orders/${order._id}`}
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center gap-1">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link rounded-3 border-0 shadow-sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &laquo; Prev
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <li
                  key={page}
                  className={`page-item ${currentPage === page ? "active" : ""}`}
                >
                  <button
                    className="page-link rounded-3 border-0 shadow-sm fw-semibold"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              );
            })}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link rounded-3 border-0 shadow-sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
