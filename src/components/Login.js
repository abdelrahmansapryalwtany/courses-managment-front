import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearAuthError } from "../rtk/slices/auth-slice";
import { Toast } from "../utils/toast";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(clearAuthError());
    if (token) navigate("/");
  }, [dispatch, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      Toast.fire({ icon: "success", title: "Welcome back!" });
      navigate("/");
    } catch (err) {
      // الخطأ سيظهر تلقائياً في التنبيه داخل الفورم
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="text-center mb-4">
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="text-muted small">Sign in to your account</p>
            </div>
            {/* Demo Accounts Box */}
            <div className="alert alert-light border rounded-4 p-3 mb-4 small">
              <div className="fw-bold text-dark mb-2">🔑 Quick Demo Login</div>

              <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 border mb-2">
                <div>
                  <span className="badge bg-danger-subtle text-danger me-1">
                    ADMIN
                  </span>
                  <span className="text-muted">Full Access</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 py-0"
                  onClick={() => {
                    setEmail("admin@gmail.com");
                    setPassword("admin");
                  }}
                >
                  Fill Admin
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded-3 border">
                <div>
                  <span className="badge bg-warning-subtle text-warning-emphasis me-1">
                    MANAGER
                  </span>
                  <span className="text-muted">Products & Orders</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 py-0"
                  onClick={() => {
                    setEmail("manager@gmail.com");
                    setPassword("manager");
                  }}
                >
                  Fill Manager
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 rounded-pill fw-semibold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-muted small mt-4 mb-0">
              Don't have an account?{" "}
              <Link to="/register" className="fw-semibold text-decoration-none">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
