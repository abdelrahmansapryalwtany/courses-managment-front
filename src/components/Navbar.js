import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../rtk/slices/auth-slice";
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
            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link px-2 ${
                      isActive ? "active fw-bold text-primary" : "text-dark"
                    }`
                  }
                >
                  Admin
                </NavLink>
              </li>
            )}
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
              <button
                className="btn btn-outline-danger fw-semibold px-3 rounded-pill"
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
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
