import React, { useState, useEffect } from 'react';
import Product from './Product';
// import prductsData from '../data/productsData';

export default function ProductList() {

    // const [products, setProducts] = useState([]);

    // useEffect(() => {
    //     fetch('https://fakestoreapi.com/products')
    //         .then(response => response.json())
    //         .then(data => setProducts(data));
    // }, []);

    // const productsData = products.map((product) => (
    //     product.price > 3 ?
    //         <Product key={product.id} product={product} />
    //         : null
    // ));
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const getProducts = (page = 1) => {
        fetch(`${process.env.REACT_APP_API_URL}/api/products?page=${page}&limit=${limit}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data.data.products);
                setTotalPages(data.data.totalPages);
                setCurrentPage(data.data.currentPage);
            });
    };

    const getCategories = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/products/categories`)
            .then(response => response.json())
            .then(data => setCategories(data.data.categories));
    }


    const getCategoryProducts = (category, page = 1) => {
        fetch(`${process.env.REACT_APP_API_URL}/api/products/category/${category}?page=${page}&limit=${limit}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data.data.products);
                setTotalPages(data.data.totalPages);
                setCurrentPage(data.data.currentPage);
            });
    }

    useEffect(() => {
        getProducts(1);
        getCategories();
    }, []);

    return (
        <>
            <div className="container py-4">

                {/* Page Header */}
                <div className="text-center mb-4">
                    <h2 className="fw-bold">Our Products</h2>
                    <p className="text-muted">
                        Browse our latest products
                    </p>
                </div>

                {/* Filters */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">

                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">

                            {/* Categories */}
                            <div className="d-flex flex-wrap gap-2">

                                <button
                                    className={`btn ${selectedCategory === null
                                        ? "btn-primary"
                                        : "btn-outline-primary"
                                        }`}
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        getProducts(1);
                                    }}
                                >
                                    All
                                </button>

                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        className={`btn ${selectedCategory === category
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                            }`}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            getCategoryProducts(category, 1);
                                        }}
                                    >
                                        {category}
                                    </button>
                                ))}

                            </div>

                            {/* Products Per Page */}
                            <div className="d-flex align-items-center gap-2">

                                <label
                                    htmlFor="limit"
                                    className="text-muted text-nowrap"
                                >
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

                                <button
                                    className="btn btn-dark"
                                    onClick={() => {
                                        if (selectedCategory) {
                                            getCategoryProducts(selectedCategory, 1);
                                        } else {
                                            getProducts(1);
                                        }
                                    }}
                                >
                                    Apply
                                </button>

                            </div>

                        </div>

                    </div>
                </div>

                {/* Products */}
                <div className="row g-4">

                    {products.map((product) => (
                        <div
                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                            key={product._id}
                        >
                            <Product
                                product={product}
                                showButton={true}
                            />
                        </div>
                    ))}

                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-center mt-5">

                    <nav>
                        <ul className="pagination shadow-sm">

                            {/* Previous */}
                            <li
                                className={`page-item ${currentPage === 1 ? "disabled" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => {
                                        if (selectedCategory) {
                                            getCategoryProducts(selectedCategory, currentPage - 1);
                                        } else {
                                            getProducts(currentPage - 1);
                                        }
                                    }}
                                    disabled={currentPage === 1}
                                >
                                    &laquo; Previous
                                </button>
                            </li>

                            {/* Pages */}
                            {Array.from(
                                { length: totalPages },
                                (_, index) => {
                                    const page = index + 1;

                                    return (
                                        <li
                                            key={page}
                                            className={`page-item ${currentPage === page
                                                ? "active"
                                                : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => {
                                                    if (selectedCategory) {
                                                        getCategoryProducts(selectedCategory, page);
                                                    } else {
                                                        getProducts(page);
                                                    }
                                                }}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    );
                                }
                            )}

                            {/* Next */}
                            <li
                                className={`page-item ${currentPage === totalPages
                                    ? "disabled"
                                    : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => {
                                        if (selectedCategory) {
                                            getCategoryProducts(selectedCategory, currentPage + 1);
                                        } else {
                                            getProducts(currentPage + 1);
                                        }
                                    }}
                                    disabled={
                                        currentPage === totalPages
                                    }
                                >
                                    Next &raquo;
                                </button>
                            </li>

                        </ul>
                    </nav>

                </div>

            </div>
        </>
    );
}