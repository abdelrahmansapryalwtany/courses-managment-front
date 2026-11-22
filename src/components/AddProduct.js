import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories, addProduct } from "../rtk/slices/products-slice";

function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { categories, submitting } = useSelector((state) => state.products);

  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    image: null,
    category: "",
  });

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("image", product.image);

    try {
      await dispatch(addProduct(formData)).unwrap();
      navigate("/admin");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4">
            {/* Header */}
            <div className="card-header bg-white border-0 pt-4 px-4">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 fw-semibold">
                ADMIN PANEL
              </span>
              <h2 className="fw-bold mb-1">Add Product</h2>
              <p className="text-muted mb-0">Add a new product to your store</p>
            </div>

            {/* Form */}
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-semibold">
                    Product Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Enter product title"
                    value={product.title}
                    onChange={(e) =>
                      setProduct({ ...product, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Price & Category في صف واحد لتوفير المساحة */}
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="price" className="form-label fw-semibold">
                      Product Price ($)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(e) =>
                        setProduct({ ...product, price: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label
                      htmlFor="category"
                      className="form-label fw-semibold"
                    >
                      Category
                    </label>
                    <select
                      className="form-select text-capitalize"
                      id="category"
                      value={product.category}
                      onChange={(e) =>
                        setProduct({ ...product, category: e.target.value })
                      }
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    placeholder="Write a clear description..."
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Image + Live Preview */}
                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-semibold">
                    Product Image
                  </label>

                  {product.image && (
                    <div className="text-center mb-3 p-3 bg-light rounded-3 border">
                      <img
                        src={URL.createObjectURL(product.image)}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ height: "180px", objectFit: "contain" }}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={(e) =>
                      setProduct({ ...product, image: e.target.files[0] })
                    }
                    required
                  />
                </div>

                {/* Submit Buttons */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1 py-2 fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? "Adding Product..." : "Add Product"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => navigate("/admin")}
                    disabled={submitting}
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
