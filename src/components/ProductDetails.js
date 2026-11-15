import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import Product from "./Product";

function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/products/${productId}`)
        .then(res => res.json())
        .then(data => setProduct(data.data.product))    
    }, []);
  return (
    <div className="container">
      <h1>Product Details</h1>
      <p>Product Price: ${product.price?.toFixed(2)}</p>
      <Product product={product} showButton={false} />
     
    </div>
  )
}

export default ProductDetails