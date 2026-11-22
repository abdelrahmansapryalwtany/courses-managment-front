import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, clearAuthError } from "../rtk/slices/auth-slice";
import { Toast } from "../utils/toast";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatar: null,
  });

  useEffect(() => {
    dispatch(clearAuthError());
    if (token) navigate("/");
  }, [dispatch, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
      Toast.fire({ icon: "success", title: "Account created successfully!" });
      navigate("/");
    } catch (err) {}
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="text-center mb-4">
              <h3 className="fw-bold mb-1">Create Account</h3>
              <p className="text-muted small">Join MyStore today</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold small">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold small">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">
                  Avatar (Optional)
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, avatar: e.target.files[0] })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 rounded-pill fw-semibold"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-muted small mt-4 mb-0">
              Already have an account?{" "}
              <Link to="/login" className="fw-semibold text-decoration-none">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
