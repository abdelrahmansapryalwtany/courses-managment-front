import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSingleProduct,
  fetchCategories,
  updateProduct,
  clearSelectedProduct,
} from "../rtk/slices/products-slice";

function EditProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();

  const { selectedProduct, categories, loading, submitting } = useSelector(
    (state) => state.products,
  );

  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    image: null,
    category: "",
  });

  // جلب بيانات المنتج والتصنيفات
  useEffect(() => {
    dispatch(fetchSingleProduct(productId));
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    return () => {
      dispatch(clearSelectedProduct()); // تنظيف البيانات عند مغادرة الصفحة
    };
  }, [dispatch, productId, categories.length]);

  // تعبئة الفورم فور وصول بيانات المنتج من Redux
  useEffect(() => {
    if (selectedProduct) {
      setProduct({
        title: selectedProduct.title || "",
        price: selectedProduct.price || "",
        description: selectedProduct.description || "",
        image: selectedProduct.image || null,
        category: selectedProduct.category || "",
      });
    }
  }, [selectedProduct]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category);

    if (product.image instanceof File) {
      formData.append("image", product.image);
    }

    try {
      await dispatch(updateProduct({ productId, formData })).unwrap();
      navigate("/admin");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4">
            {/* Header */}
            <div className="card-header bg-white border-0 pt-4 px-4">
              <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-1 mb-2 fw-semibold">
                EDIT MODE
              </span>
              <h2 className="fw-bold mb-1">Edit Product</h2>
              <p className="text-muted mb-0">Update product information</p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-semibold">
                    Product Title
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="title"
                    value={product.title}
                    onChange={(e) =>
                      setProduct({ ...product, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Price & Category في صف واحد */}
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="price" className="form-label fw-semibold">
                      Product Price ($)
                    </label>
                    <input
                      className="form-control"
                      type="number"
                      id="price"
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
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Current / New Image Preview */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Product Image
                  </label>

                  {product.image && (
                    <div className="text-center mb-3 p-3 bg-light rounded-3 border">
                      <img
                        src={
                          product.image instanceof File
                            ? URL.createObjectURL(product.image)
                            : `${process.env.REACT_APP_API_URL}/uploads/${product.image}`
                        }
                        alt={product.title}
                        className="img-fluid rounded"
                        style={{
                          height: "200px",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  )}

                  <input
                    className="form-control"
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(e) =>
                      setProduct({ ...product, image: e.target.files[0] })
                    }
                  />
                  <div className="form-text">
                    Leave empty to keep the current image.
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary flex-grow-1 py-2 fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? "Updating..." : "Update Product"}
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

export default EditProduct;
