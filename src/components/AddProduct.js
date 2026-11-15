import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const navigate = useNavigate();

    
    const [product, setProduct] = useState({
        title: '',
        price: '',
        description: '',
        image: null,
        category: ''
    });
    
    
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        // Fetch categories from the API and set them in state
        fetch(`${process.env.REACT_APP_API_URL}/api/products/categories`)
        .then(response => response.json())
        .then(categories => {
            setCategories(categories.data.categories);
        });
    }, []);
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('title', product.title);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('image', product.image);

        fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(product)

            body: formData
        })
            // .then(response => response.json())
            // .then(data => {
            //     console.log('Product added:', data);
            //     navigate('/admin');
            // })
            // .catch(error => {
            //     console.error('Error adding product:', error);
            // });
            .then(response => response.json())
            .then(data => {
                console.log('Product added:', data);
                navigate('/admin');
            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
    };

    return (
    <div className="container py-5">

        <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

                <div className="card border-0 shadow-sm">

                    {/* Header */}
                    <div className="card-header bg-white border-0 pt-4 px-4">
                        <h2 className="fw-bold mb-1">
                            Add Product
                        </h2>

                        <p className="text-muted mb-0">
                            Add a new product to your store
                        </p>
                    </div>

                    {/* Form */}
                    <div className="card-body p-4">

                        <form onSubmit={handleSubmit}>

                            {/* Title */}
                            <div className="mb-3">
                                <label
                                    htmlFor="title"
                                    className="form-label fw-semibold"
                                >
                                    Product Title
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    placeholder="Enter product title"
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            title: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                                <label
                                    htmlFor="price"
                                    className="form-label fw-semibold"
                                >
                                    Product Price
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    id="price"
                                    placeholder="Enter product price"
                                    min="0"
                                    step="0.01"
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            price: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label
                                    htmlFor="description"
                                    className="form-label fw-semibold"
                                >
                                    Product Description
                                </label>

                                <textarea
                                    className="form-control"
                                    id="description"
                                    rows="4"
                                    placeholder="Enter product description"
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            description: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* Image */}
                            <div className="mb-3">
                                <label
                                    htmlFor="image"
                                    className="form-label fw-semibold"
                                >
                                    Product Image
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            image: e.target.files[0]
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label
                                    htmlFor="category"
                                    className="form-label fw-semibold"
                                >
                                    Product Category
                                </label>

                                <select
                                    className="form-select"
                                    id="category"
                                    value={product.category}
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            category: e.target.value
                                        })
                                    }
                                    required
                                >
                                    <option value="">
                                        Select a category
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit */}
                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary flex-grow-1"
                                >
                                    Add Product
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/admin')}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>
        </div>

    </div>
);
}

export default AddProduct;
