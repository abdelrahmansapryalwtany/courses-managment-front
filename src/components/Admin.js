import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Admin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const getProducts = (page = 1) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products?page=${page}&limit=${limit}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data.products);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.currentPage);
      });
  };

  // const getCategoryProducts = (category) => {
  //     fetch(`http://localhost:4000/api/products/category/${category}`)
  //         .then(response => response.json())
  //         .then(data => setProducts(data.data.products));
  // }

  const deleteProduct = (product) => {
    Swal.fire({
      title: "Are you sure ?",
      text: `You won't be able to revert ${product.title} !`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.REACT_APP_API_URL}/api/products/${product._id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.data);
            getProducts();
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
          })
          .catch((error) => {
            console.error(error);

            Swal.fire("Error!", "Something went wrong.", "error");
          });
      }
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  // onClick={() => {
  //             const product = { title: 'New Product', price: 29.99 };
  //             fetch('https://fakestoreapi.com/products', {
  //                 method: 'POST',
  //                 headers: { 'Content-Type': 'application/json' },
  //                 body: JSON.stringify(product)
  //             })
  //                 .then(response => response.json())
  //                 .then(data => console.log(data));
  //         }}

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Products Management</h2>
          <p className="text-muted mb-0">Manage your products</p>
        </div>

        <Link className="btn btn-success" to="/add-product">
          + Add Product
        </Link>
      </div>

      {/* Products Per Page */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-2">
            <label htmlFor="limit" className="text-muted text-nowrap">
              Products per page:
            </label>

            <input
              type="number"
              id="limit"
              className="form-control"
              style={{ width: "80px" }}
              value={limit}
              min="1"
              onChange={(e) => setLimit(e.target.value)}
            />

            <button className="btn btn-primary" onClick={() => getProducts(1)}>
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  {/* <th>Product ID</th> */}
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    {/* <td>{product.id}</td> */}

                    <td>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
                        alt={product.title}
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                      />
                    </td>

                    <td>
                      <div className="fw-semibold">{product.title}</div>
                    </td>

                    <td>
                      <span className="fw-bold">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </td>

                    <td>
                      <div className="text-muted" style={{ maxWidth: "400px" }}>
                        {product.description}
                      </div>
                    </td>

                    <td className="text-center">
                      <div className="btn-group">
                        <Link
                          to={`/product/${product._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </Link>

                        <Link
                          to={`/edit-product/${product._id}`}
                          className="btn btn-sm btn-warning"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteProduct(product)}
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
        </div>
      </div>

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => getProducts(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => getProducts(page)}>
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
              className="page-link"
              onClick={() => getProducts(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Admin;
