import { useSelector, useDispatch } from "react-redux";
import { logout } from "../rtk/slices/auth-slice";
import { NavLink, Link } from "react-router-dom";
import { Toast } from "../utils/toast";
function Navbar() {
  const cart = useSelector((state) => state.cart);
  const { token, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top py-3"
      style={{ zIndex: 1030 }}
    >
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 text-primary" to="/">
          MyStore
        </NavLink>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link px-2 ${
                    isActive ? "active fw-bold text-primary" : "text-dark"
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link px-2 ${
                    isActive ? "active fw-bold text-primary" : "text-dark"
                  }`
                }
              >
                About
              </NavLink>
            </li>
            {token && (
              <li className="nav-item">
                <NavLink
                  to="/my-orders"
                  className={({ isActive }) =>
                    `nav-link px-2 ${
                      isActive ? "active fw-bold text-primary" : "text-dark"
                    }`
                  }
                >
                  My Orders
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              {isAdmin ? (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link px-2 ${isActive ? "active fw-bold text-primary" : "text-dark"}`
                  }
                >
                  Admin
                </NavLink>
              ) : (
                <Link
                  to="/login"
                  className="nav-link px-2 text-muted"
                  title="Login as Admin or Manager to access Dashboard"
                  onClick={() =>
                    Toast.fire({
                      icon: "info",
                      title:
                        "Login with Demo Admin/Manager to access Dashboard",
                      timer: 5000,
                    })
                  }
                >
                  Admin 🔒
                </Link>
              )}
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <NavLink
              to="/cart"
              className="btn btn-outline-primary position-relative fw-semibold px-3 rounded-pill"
            >
              🛒 Cart{" "}
              <span className="badge bg-danger rounded-pill ms-1">
                {cart.length}
              </span>
            </NavLink>

            <NavLink
              to="/wishlist"
              className="btn btn-outline-danger position-relative fw-semibold px-3 rounded-pill"
            >
              ❤️{" "}
              <span className="badge bg-danger rounded-pill ms-1">
                {wishlist.length}
              </span>
            </NavLink>

            {token ? (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/profile"
                  className="btn btn-light border rounded-pill d-flex align-items-center gap-2 px-3 py-1 fw-semibold text-dark"
                  title="My Profile"
                >
                  {user?.avatar ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${user.avatar}`}
                      alt={user.firstName}
                      className="rounded-circle object-fit-cover"
                      style={{ width: "26px", height: "26px" }}
                    />
                  ) : (
                    <span
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center small fw-bold"
                      style={{ width: "26px", height: "26px" }}
                    >
                      {user?.firstName?.charAt(0)?.toUpperCase() ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </span>
                  )}
                  <span className="small">{user?.firstName || "Profile"}</span>
                </Link>

                <button
                  className="btn btn-outline-danger fw-semibold px-3 rounded-pill"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="btn btn-primary fw-semibold px-3 rounded-pill"
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
