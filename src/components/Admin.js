import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchProducts,
  fetchCategories,
  deleteProduct,
} from "../rtk/slices/products-slice";
import { fetchOrders } from "../rtk/slices/orders-slice";

function Admin() {
  const dispatch = useDispatch();

  const {
    items: products,
    categories,
    totalPages,
    currentPage,
    loading,
  } = useSelector((state) => state.products);
  const { items: orders } = useSelector((state) => state.orders);
  const { token } = useSelector((state) => state.auth);

  const [limit, setLimit] = useState(10);
  const [appliedLimit, setAppliedLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchOrders());

    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const usersList = data.data?.users || data.users || [];
          setUsersCount(usersList.length);
        })
        .catch(() => {});
    }
  }, [dispatch, token]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(
        fetchProducts({
          category: selectedCategory,
          page: 1,
          limit: appliedLimit,
          search: searchQuery.trim(),
        }),
      );
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedCategory, appliedLimit, dispatch]);

  const totalRevenue = (orders || [])
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  const pendingOrdersCount = (orders || []).filter(
    (order) => order.status === "Pending",
  ).length;

  const handleDelete = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert "${product.title}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteProduct(product._id)).unwrap();
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        } catch (error) {
          Swal.fire(
            "Error!",
            error.message || "Something went wrong.",
            "error",
          );
        }
      }
    });
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
            ADMIN DASHBOARD
          </span>
          <h2 className="fw-bold mb-1">Store Overview & Products</h2>
          <p className="text-muted mb-0">
            Monitor store metrics and manage your product catalog
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link
            className="btn btn-outline-dark px-4 py-2 rounded-pill fw-semibold"
            to="/admin/users"
          >
            👥 Users
          </Link>

          <Link
            className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold position-relative"
            to="/admin/orders"
          >
            📦 Orders
            {pendingOrdersCount > 0 && (
              <span className="badge bg-danger rounded-pill ms-2">
                {pendingOrdersCount}
              </span>
            )}
          </Link>

          <Link
            className="btn btn-success px-4 py-2 rounded-pill fw-semibold shadow-sm"
            to="/add-product"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-success-subtle text-success rounded-3 d-flex align-items-center justify-content-center fs-4"
                style={{ width: "50px", height: "50px" }}
              >
                💰
              </div>
              <div>
                <div className="text-muted small fw-semibold">
                  Total Revenue
                </div>
                <h4 className="fw-bold mb-0 text-dark">
                  ${totalRevenue.toFixed(2)}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center fs-4"
                style={{ width: "50px", height: "50px" }}
              >
                📦
              </div>
              <div>
                <div className="text-muted small fw-semibold">Total Orders</div>
                <h4 className="fw-bold mb-0 text-dark">
                  {(orders || []).length}{" "}
                  <small className="text-warning fs-6 fw-normal">
                    ({pendingOrdersCount} pending)
                  </small>
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-info-subtle text-info rounded-3 d-flex align-items-center justify-content-center fs-4"
                style={{ width: "50px", height: "50px" }}
              >
                🛍️
              </div>
              <div>
                <div className="text-muted small fw-semibold">
                  Shown Products
                </div>
                <h4 className="fw-bold mb-0 text-dark">
                  {(products || []).length}{" "}
                  <small className="text-muted fs-6 fw-normal">
                    ({(categories || []).length} cats)
                  </small>
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-warning-subtle text-warning-emphasis rounded-3 d-flex align-items-center justify-content-center fs-4"
                style={{ width: "50px", height: "50px" }}
              >
                👥
              </div>
              <div>
                <div className="text-muted small fw-semibold">
                  Registered Users
                </div>
                <h4 className="fw-bold mb-0 text-dark">{usersCount}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white">
        <div className="card-body p-3 p-md-4">
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-pill px-4 bg-light border-0"
              placeholder="🔍 Search all products in database by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                  selectedCategory === null
                    ? "btn-primary"
                    : "btn-light text-dark"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>

              {(categories || []).map((category) => (
                <button
                  key={category}
                  className={`btn btn-sm rounded-pill px-3 fw-semibold text-capitalize ${
                    selectedCategory === category
                      ? "btn-primary"
                      : "btn-light text-dark"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-3">
              <label
                htmlFor="limit"
                className="text-muted small fw-semibold text-nowrap mb-0 ps-1"
              >
                Rows:
              </label>
              <input
                type="number"
                id="limit"
                className="form-control form-control-sm text-center fw-bold border-0 shadow-none"
                style={{ width: "65px" }}
                value={limit}
                min="1"
                onChange={(e) => setLimit(Number(e.target.value) || 1)}
              />
              <button
                className="btn btn-dark btn-sm px-3 rounded-2"
                onClick={() => setAppliedLimit(limit)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5 my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading products...</p>
            </div>
          ) : (products || []).length === 0 ? (
            <div className="text-center py-5 my-4">
              <h5 className="fw-bold text-muted">No products found</h5>
              <p className="text-muted small mb-0">
                Try changing your search keyword or category filter.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 py-3">Image</th>
                    <th className="py-3">Product</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Price</th>
                    <th className="py-3">Description</th>
                    <th className="pe-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {(products || []).map((product) => (
                    <tr key={product._id}>
                      <td className="ps-4 py-3">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
                          alt={product.title}
                          className="border rounded-3 p-1 bg-white"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                          }}
                        />
                      </td>

                      <td>
                        <div className="fw-semibold text-dark">
                          {product.title}
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-light text-secondary border text-capitalize">
                          {product.category || "General"}
                        </span>
                      </td>

                      <td>
                        <span className="fw-bold text-primary">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <div
                          className="text-muted small text-truncate"
                          style={{ maxWidth: "260px" }}
                          title={product.description}
                        >
                          {product.description}
                        </div>
                      </td>

                      <td className="pe-4 text-end">
                        <div className="d-inline-flex gap-2">
                          <Link
                            to={`/product/${product._id}`}
                            className="btn btn-sm btn-outline-primary px-3"
                          >
                            View
                          </Link>

                          <Link
                            to={`/edit-product/${product._id}`}
                            className="btn btn-sm btn-outline-warning px-3"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn btn-sm btn-outline-danger px-3"
                            onClick={() => handleDelete(product)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center gap-1">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link rounded-3 border-0 shadow-sm"
                onClick={() =>
                  dispatch(
                    fetchProducts({
                      category: selectedCategory,
                      page: currentPage - 1,
                      limit: appliedLimit,
                      search: searchQuery.trim(),
                    }),
                  )
                }
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
                    onClick={() =>
                      dispatch(
                        fetchProducts({
                          category: selectedCategory,
                          page,
                          limit: appliedLimit,
                          search: searchQuery.trim(),
                        }),
                      )
                    }
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
                  dispatch(
                    fetchProducts({
                      category: selectedCategory,
                      page: currentPage + 1,
                      limit: appliedLimit,
                      search: searchQuery.trim(),
                    }),
                  )
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

export default Admin;
