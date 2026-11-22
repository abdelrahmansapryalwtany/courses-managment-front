import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchProducts,
  fetchCategories,
  deleteProduct,
} from "../rtk/slices/products-slice";

function Admin() {
  const dispatch = useDispatch();

  const {
    items: products,
    categories,
    totalPages,
    currentPage,
    loading,
  } = useSelector((state) => state.products);

  const [limit, setLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(fetchProducts({ category, page: 1, limit }));
  };

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
          console.error(error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
            DASHBOARD
          </span>
          <h2 className="fw-bold mb-1">Products Management</h2>
          <p className="text-muted mb-0">
            View, filter, edit, or remove store products
          </p>
        </div>

        <Link
          className="btn btn-success px-4 py-2 rounded-pill fw-semibold shadow-sm"
          to="/add-product"
        >
          + Add New Product
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                  selectedCategory === null
                    ? "btn-primary"
                    : "btn-light text-dark"
                }`}
                onClick={() => handleCategoryChange(null)}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn btn-sm rounded-pill px-3 fw-semibold text-capitalize ${
                    selectedCategory === category
                      ? "btn-primary"
                      : "btn-light text-dark"
                  }`}
                  onClick={() => handleCategoryChange(category)}
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
                onClick={() =>
                  dispatch(
                    fetchProducts({
                      category: selectedCategory,
                      page: 1,
                      limit,
                    }),
                  )
                }
              >
                Apply
              </button>
            </div>
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
              <p className="text-muted mt-2 mb-0">Loading products...</p>
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
                  {products.map((product) => (
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
                          style={{ maxWidth: "280px" }}
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
                      limit,
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
                          limit,
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
                      limit,
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
