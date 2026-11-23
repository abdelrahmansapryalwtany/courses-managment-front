export default function FeaturesBar() {
  const items = [
    { icon: "🚚", title: "Free Shipping", desc: "On all orders over $50" },
    { icon: "🔒", title: "Secure Payment", desc: "100% protected via Stripe" },
    { icon: "🔄", title: "Easy Returns", desc: "14-day money-back guarantee" },
    { icon: "📞", title: "24/7 Support", desc: "Dedicated customer service" },
  ];

  return (
    <div className="container mt-4">
      <div className="card border-0 shadow-sm rounded-4 bg-white">
        <div className="card-body py-3 px-4">
          <div className="row g-3">
            {items.map((item, idx) => (
              <div className="col-12 col-sm-6 col-lg-3" key={idx}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center fs-4 flex-shrink-0"
                    style={{ width: "48px", height: "48px" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark small">
                      {item.title}
                    </h6>
                    <small className="text-muted">{item.desc}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
