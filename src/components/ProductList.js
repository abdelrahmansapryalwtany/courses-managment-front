import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, fetchCategories } from "../rtk/slices/products-slice";
import Product from "./Product";

export default function ProductList() {
  const dispatch = useDispatch();

  const {
    items: products,
    categories,
    totalPages,
    currentPage,
    loading,
  } = useSelector((state) => state.products);

  const [limit, setLimit] = useState(9);
  const [appliedLimit, setAppliedLimit] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // البحث والجلب من السيرفر مع Debounce (ينتظر 400ms بعد توقف الكتابة)
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePageChange = (newPage) => {
    dispatch(
      fetchProducts({
        category: selectedCategory,
        page: newPage,
        limit: appliedLimit,
        search: searchQuery.trim(),
      }),
    );
    document
      .getElementById("products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortBy("default");
    setMaxPrice("");
    setSelectedCategory(null);
  };

  // فلترة السعر والترتيب على المنتجات القادمة من السيرفر
  const processedProducts = (products || [])
    .filter((p) => !maxPrice || Number(p.price) <= Number(maxPrice))
    .sort((a, b) => {
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <div className="container py-5" id="products-section">
      {/* رأس القسم */}
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
        <div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-2 fw-semibold">
            COLLECTION
          </span>
          <h2 className="fw-bold mb-0">Explore Our Products</h2>
        </div>
        <span className="text-muted small">
          Showing <strong>{processedProducts.length}</strong> products
        </span>
      </div>

      <div className="row g-4">
        {/* العمود الأيسر: الشريط الجانبي للفلاتر (Sidebar) */}
        <div className="col-12 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">🎛️ Filters</h6>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none small"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>

            {/* 1. البحث من السيرفر */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted">
                Search
              </label>
              <input
                type="text"
                className="form-control form-control-sm rounded-pill px-3 bg-light border-0"
                placeholder="🔍 Search all products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 2. التصنيفات */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted">
                Categories
              </label>
              <div className="d-flex flex-column gap-1">
                <button
                  className={`btn btn-sm text-start rounded-3 px-3 py-2 fw-semibold ${
                    selectedCategory === null
                      ? "btn-primary"
                      : "btn-light text-dark bg-transparent"
                  }`}
                  onClick={() => handleCategoryChange(null)}
                >
                  All Products
                </button>

                {categories.map((category) => (
                  <button
                    key={category}
                    className={`btn btn-sm text-start rounded-3 px-3 py-2 fw-semibold text-capitalize ${
                      selectedCategory === category
                        ? "btn-primary"
                        : "btn-light text-dark bg-transparent"
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. أقصى سعر */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted">
                Max Price ($)
              </label>
              <input
                type="number"
                className="form-control form-control-sm bg-light border-0"
                placeholder="e.g. 500"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* 4. الترتيب */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-muted">
                Sort By
              </label>
              <select
                className="form-select form-select-sm bg-light border-0"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* 5. عدد المنتجات في الصفحة */}
            <div>
              <label className="form-label small fw-semibold text-muted">
                Items per page
              </label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm text-center fw-bold bg-light border-0"
                  value={limit}
                  min="1"
                  onChange={(e) => setLimit(Number(e.target.value) || 1)}
                />
                <button
                  className="btn btn-dark btn-sm px-3"
                  onClick={() => setAppliedLimit(limit)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الأيمن: شبكة المنتجات */}
        <div className="col-12 col-lg-9">
          {loading ? (
            <div className="text-center py-5 my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2">Loading products...</p>
            </div>
          ) : processedProducts.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <h5 className="fw-bold text-muted mb-2">No products found</h5>
              <p className="text-muted small mb-3">
                Try adjusting your search or filter criteria.
              </p>
              <div>
                <button
                  className="btn btn-outline-primary btn-sm rounded-pill px-4"
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {processedProducts.map((product) => (
                  <div className="col-12 col-sm-6 col-xl-4" key={product._id}>
                    <Product product={product} showButton={true} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <nav aria-label="Page navigation">
                    <ul className="pagination gap-1">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
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
                            className={`page-item ${
                              currentPage === page ? "active" : ""
                            }`}
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
      </div>
    </div>
  );
}
