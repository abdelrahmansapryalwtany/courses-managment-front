import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <h5 className="fw-bold text-white mb-3">MyStore</h5>
            <p className="text-secondary small lh-lg">
              Your one-stop destination for quality products at unbeatable
              prices. Fast delivery, secure checkout, and top-notch customer
              support.
            </p>
          </div>

          <div className="col-md-3 offset-md-1">
            <h6 className="fw-bold text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="text-secondary text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-secondary text-decoration-none"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-secondary text-decoration-none"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold text-white mb-3">Contact</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li>📍 Cairo, Egypt</li>
              <li>📞 +20 102 490 2898</li>
              <li>✉️ abdelrahman.sapry.alwtany@gmail.com</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="text-center text-secondary small">
          &copy; {new Date().getFullYear()} MyStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
