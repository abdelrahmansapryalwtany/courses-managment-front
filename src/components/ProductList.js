import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, fetchCategories } from "../rtk/slices/products-slice";
import Product from "./Product";

export default function ProductList() {
  const dispatch = useDispatch();

  // قراءة البيانات من Redux
  const {
    items: products,
    categories,
    totalPages,
    currentPage,
    loading,
  } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState("");
  // حالات الفلتر المحلية فقط
  const [limit, setLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(fetchProducts({ category, page: 1, limit }));
  };

  const handlePageChange = (newPage) => {
    dispatch(
      fetchProducts({ category: selectedCategory, page: newPage, limit }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" }); // صعود ناعم لأعلى الصفحة عند تغيير الرقم
  };

  return (
    <div className="container py-5">
      {/* رأس الصفحة */}
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-2 fw-semibold">
          COLLECTION
        </span>
        <h2 className="fw-bold display-6">Our Products</h2>
        <p className="text-muted">Browse our latest curated products</p>
      </div>

      {/* شريط الفلاتر وعدد المنتجات */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control rounded-pill px-4 py-2 bg-light border-0"
          placeholder="🔍 Search products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4 bg-white">
        <div className="card-body p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            {/* أزرار التصنيفات بشكل Pills عصري */}
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn rounded-pill px-3 fw-semibold ${
                  selectedCategory === null
                    ? "btn-primary shadow-sm"
                    : "btn-light text-dark"
                }`}
                onClick={() => handleCategoryChange(null)}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn rounded-pill px-3 fw-semibold text-capitalize ${
                    selectedCategory === category
                      ? "btn-primary shadow-sm"
                      : "btn-light text-dark"
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* التحكم في عدد المنتجات المعروضة */}
            <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-3">
              <label
                htmlFor="limit"
                className="text-muted small fw-semibold text-nowrap mb-0 ps-1"
              >
                Show:
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

      {/* حالة التحميل (Spinner) */}
      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading products...</p>
        </div>
      ) : (
        <>
          {/* شبكة المنتجات */}
          <div className="row g-4">
            {filteredProducts === 0 ? (
              <div className="col-12">
                <p className="text-muted text-center py-5">
                  No products found matching your search.
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={product._id}
                >
                  <Product product={product} showButton={true} />
                </div>
              ))
            )}
          </div>

          {/* أزرار التنقل بين الصفحات (Pagination) */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <nav aria-label="Page navigation">
                <ul className="pagination gap-1">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link rounded-3 border-0 shadow-sm"
                      onClick={() => handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(page)}
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
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
