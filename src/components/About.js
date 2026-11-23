import { Link } from "react-router-dom";

function About() {
  const features = [
    {
      icon: "🚚",
      title: "Fast & Free Delivery",
      desc: "Reliable shipping straight to your doorstep with real-time order tracking.",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      desc: "Flexible checkout with Cash on Delivery or encrypted online payment via Stripe.",
    },
    {
      icon: "⭐",
      title: "Curated Quality",
      desc: "Every product is carefully selected and verified to ensure the best value.",
    },
    {
      icon: "💬",
      title: "24/7 Support",
      desc: "Dedicated customer support ready to help you with any inquiries or orders.",
    },
  ];

  const techStack = [
    "MongoDB",
    "Express.js",
    "React.js",
    "Node.js",
    "Redux Toolkit",
    "Bootstrap 5",
    "JWT Auth",
    "Stripe API",
  ];

  return (
    <div className="container py-5">
      {/* 1. Hero Section */}
      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5 mb-5 text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3 fw-semibold">
              ABOUT MYSTORE
            </span>
            <h1 className="display-5 fw-bold text-dark mb-3">
              Shopping Made Simple, Fast & Reliable
            </h1>
            <p className="lead text-muted mb-4">
              Welcome to <strong>MyStore</strong> — a modern full-stack
              e-commerce platform built to deliver a seamless shopping
              experience from browsing products to secure checkout and order
              tracking.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link
                to="/"
                className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
              >
                Explore Products
              </Link>
              <Link
                to="/cart"
                className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Why Choose Us (Features Grid) */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <h3 className="fw-bold mb-1">Why Shop With Us?</h3>
          <p className="text-muted small">
            Everything we build is focused on customer satisfaction
          </p>
        </div>

        <div className="row g-4">
          {features.map((item, idx) => (
            <div className="col-12 col-sm-6 col-lg-3" key={idx}>
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <div className="display-5 mb-3">{item.icon}</div>
                <h6 className="fw-bold text-dark mb-2">{item.title}</h6>
                <p className="text-muted small mb-0 lh-base">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Tech Stack & Project Overview (ممتاز للـ Portfolio) */}
      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 p-md-5">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1 mb-2 fw-semibold">
              UNDER THE HOOD
            </span>
            <h4 className="fw-bold mb-3">Built With Modern Web Technologies</h4>
            <p className="text-muted small lh-lg mb-3">
              This platform is engineered as a complete{" "}
              <strong>MERN Stack</strong> application featuring role-based
              access control (Admin, Manager, User), persistent shopping cart
              and wishlist state management, order history audit logs, and
              integrated online payments.
            </p>
            <div className="d-flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="bg-light rounded-4 p-4 border text-center">
              <h5 className="fw-bold mb-2">Have Questions?</h5>
              <p className="text-muted small mb-3">
                We value your feedback and are always looking to improve our
                products and services.
              </p>
              <a
                href="mailto:support@mystore.com"
                className="btn btn-dark rounded-pill px-4 py-2 fw-semibold btn-sm"
              >
                ✉️ Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
