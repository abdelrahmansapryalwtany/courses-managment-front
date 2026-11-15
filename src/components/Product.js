export default function Product(props) {
    const { product, showButton } = props;
    // console.log(product);
    return (
    <div className="card h-100 border-0 shadow-sm">

        <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${product.image}`}
            className="card-img-top"
            alt={product.title}
            style={{
                height: "220px",
                objectFit: "contain",
                padding: "15px"
            }}
        />

        <div className="card-body d-flex flex-column">

            <h5 className="card-title">
                {product.title}
            </h5>

            <p className="card-text text-muted">
                {product.description}
            </p>

            <div className="mt-auto">

                <h5 className="fw-bold mb-3">
                    ${Number(product.price).toFixed(2)}
                </h5>

                {showButton && (
                    <a
                        href={`/product/${product._id}`}
                        className="btn btn-primary w-100"
                    >
                        Details
                    </a>
                )}

            </div>

        </div>
    </div>
);
}