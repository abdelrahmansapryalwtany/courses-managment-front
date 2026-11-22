import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../rtk/slices/orders-slice";
import { Toast } from "../utils/toast";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { items: orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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

  return (
    <div className="container py-5">
      {/* رأس الصفحة */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
            ADMIN PANEL
          </span>
          <h2 className="fw-bold mb-1">Customer Orders ({orders.length})</h2>
          <p className="text-muted mb-0">
            Track and manage incoming customer orders
          </p>
        </div>

        <Link
          to="/admin"
          className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold"
        >
          &larr; Manage Products
        </Link>
      </div>

      {/* جدول الطلبات */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 my-4">
              <h5 className="fw-bold text-muted">No orders yet</h5>
              <p className="text-muted small mb-0">
                When customers place orders, they will appear here.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 py-3">Customer</th>
                    <th className="py-3">Address</th>
                    <th className="py-3">Items</th>
                    <th className="py-3">Total</th>
                    <th className="py-3">Date</th>
                    <th className="pe-4 py-3 text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      {/* بيانات العميل */}
                      <td className="ps-4 py-3">
                        <div className="fw-bold text-dark">
                          {order.customer?.fullName}
                        </div>
                        <small className="text-muted">
                          📞 {order.customer?.phone}
                        </small>
                      </td>

                      {/* العنوان */}
                      <td>
                        <div className="small fw-semibold">
                          {order.customer?.city}
                        </div>
                        <div
                          className="text-muted small text-truncate"
                          style={{ maxWidth: "200px" }}
                          title={order.customer?.address}
                        >
                          {order.customer?.address}
                        </div>
                      </td>

                      {/* المنتجات المطلوبة */}
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

                      {/* الإجمالي */}
                      <td>
                        <span className="fw-bold text-primary">
                          ${Number(order.totalPrice).toFixed(2)}
                        </span>
                      </td>

                      {/* التاريخ */}
                      <td className="text-muted small">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      {/* تغيير الحالة */}
                      <td className="pe-4 text-end">
                        <select
                          className={`form-select form-select-sm d-inline-block w-auto fw-semibold rounded-pill border-0 px-3 ${getStatusBadge(
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
