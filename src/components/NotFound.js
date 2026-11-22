import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-5 text-center my-5">
      <h1 className="display-1 fw-bold text-primary">404</h1>
      <h3 className="fw-bold mb-2">Oops! Page Not Found</h3>
      <p className="text-muted mb-4">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <Link
        to="/"
        className="btn btn-primary rounded-pill px-4 py-2 fw-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
}
