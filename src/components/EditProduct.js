import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function EditProduct() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState({
        title: '',
        price: '',
        description: '',
        image: null,
        category: ''
    });
    const [categories, setCategories] = useState([]);

    const getCategories = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/products/categories`)
            .then(response => response.json())
            .then(categories => {
                setCategories(categories.data.categories);
            });
    }

    const getProduct = () => {
        fetch(`${process.env.REACT_APP_API_URL}/api/products/${productId}`)
            .then((response) => response.json())
            .then((product) => {
                setProduct({
                    title: product.data.product.title,
                    price: product.data.product.price,
                    description: product.data.product.description,
                    image: product.data.product.image,
                    category: product.data.product.category
                });
            });
    }
    useEffect(() => {
        // Fetch product details from the API and set them in state
        getProduct();
        getCategories();
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('SUBMIT FIRED');
        const formData = new FormData();
        formData.append('title', product.title);
        formData.append('price', product.price);
        formData.append('description', product.description);
        formData.append('category', product.category);
        if (product.image instanceof File) {
            formData.append('image', product.image);
        }
console.log('PRICE:', product.price);

for (const [key, value] of formData.entries()) {
    console.log(key, value);
}
        fetch(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, {
            method: 'PATCH',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Product updated:', data);
                navigate('/admin');
            })
            .catch(error => {
                console.error('Error updating product:', error);
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
                            Edit Product
                        </h2>

                        <p className="text-muted mb-0">
                            Update product information
                        </p>
                    </div>

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
                                    className="form-control"
                                    type="text"
                                    id="title"
                                    value={product.title}
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
                                    className="form-control"
                                    type="number"
                                    id="price"
                                    min="0"
                                    step="0.01"
                                    value={product.price}
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
                                    value={product.description}
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            description: e.target.value
                                        })
                                    }
                                    required
                                />
                            </div>

                            {/* Current Image */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Product Image
                                </label>

                                <div className="text-center mb-3">

                                    <img
                                        src={
                                            product.image instanceof File
                                                ? URL.createObjectURL(product.image)
                                                : `${process.env.REACT_APP_API_URL}/uploads/${product.image}`
                                        }
                                        alt={product.title}
                                        className="img-fluid rounded"
                                        style={{
                                            height: "220px",
                                            maxWidth: "100%",
                                            objectFit: "contain"
                                        }}
                                    />

                                </div>

                                <input
                                    className="form-control"
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setProduct({
                                            ...product,
                                            image: e.target.files[0]
                                        })
                                    }
                                />

                                <div className="form-text">
                                    Leave empty to keep the current image.
                                </div>
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

                            {/* Buttons */}
                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary flex-grow-1"
                                >
                                    Update Product
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

export default EditProduct;