import image1 from "../images/image-1.jpg";
import image2 from "../images/image-2.jpg";
import image3 from "../images/image-3.jpg";
import "./Slider.css";

function Slider() {
  const slides = [
    {
      image: image1,
      badge: "NEW ARRIVALS",
      title: "Upgrade Your Lifestyle",
      subtitle:
        "Discover the latest collection with exclusive deals and fast delivery.",
    },
    {
      image: image2,
      badge: "SPECIAL OFFER",
      title: "Up to 40% Off Today",
      subtitle:
        "Shop top-rated products curated just for you at unbeatable prices.",
    },
    {
      image: image3,
      badge: "BEST SELLERS",
      title: "Quality You Can Trust",
      subtitle:
        "Explore our most popular items loved by thousands of customers.",
    },
  ];

  return (
    <div className="container mt-4">
      <div
        id="heroCarousel"
        className="carousel slide carousel-fade rounded-4 overflow-hidden shadow-sm"
        data-bs-ride="carousel"
        data-bs-interval="3500"
      >
        {/* المؤشرات السفلية */}
        <div className="carousel-indicators mb-3">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* الشرائح */}
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="slider-image-wrapper">
                <img
                  src={slide.image}
                  className="d-block w-100 slider-img"
                  alt={slide.title}
                />
                {/* طبقة تعتيم خفيفة لإبراز النص */}
                <div className="slider-overlay"></div>
              </div>

              {/* محتوى النص فوق الصورة */}
              <div className="carousel-caption text-start d-flex flex-column justify-content-center h-100 pb-0">
                <div className="col-lg-7">
                  <span className="badge bg-primary rounded-pill px-3 py-2 mb-3 fw-semibold shadow-sm">
                    {slide.badge}
                  </span>
                  <h2 className="display-5 fw-bold text-white mb-2">
                    {slide.title}
                  </h2>
                  <p className="lead text-light mb-4 d-none d-md-block">
                    {slide.subtitle}
                  </p>
                  <a
                    href="#products-section"
                    className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm"
                  >
                    Shop Now &darr;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* أزرار التنقل الدائرية */}
        <button
          className="carousel-control-prev custom-carousel-btn"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next custom-carousel-btn"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default Slider;
