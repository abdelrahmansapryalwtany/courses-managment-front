function About() {
    return (
    <div className="container py-5">

        <div className="row justify-content-center">
            <div className="col-12 col-lg-8">

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4 p-md-5">

                        <div className="text-center mb-4">
                            <h1 className="fw-bold mb-2">
                                About Us
                            </h1>

                            <p className="text-muted mb-0">
                                Learn more about our application
                            </p>
                        </div>

                        <hr className="mb-4" />

                        <p className="text-muted">
                            This is the about page of our application.
                            Here you can find information about our
                            company, mission, and values.
                        </p>

                        <p className="text-muted">
                            We are committed to providing the best
                            products and services to our customers.
                            Our team works tirelessly to ensure
                            customer satisfaction and continuous
                            improvement.
                        </p>

                        <p className="text-muted mb-0">
                            Feel free to reach out to us with any
                            questions or feedback. We value your input
                            and look forward to hearing from you!
                        </p>

                    </div>
                </div>

            </div>
        </div>

    </div>
);
}

export default About;