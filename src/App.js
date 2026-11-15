// import logo from './logo.svg';
// import './App.css';
import Form from './components/Form';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import SignUp from './components/SignUp';
import { useState } from 'react';
import Slider from './components/Slider';
import { Routes, Route } from 'react-router-dom';
import About from './components/About';
import ProductDetails from './components/ProductDetails';
import Admin from './components/Admin';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';


function App() {

  const [loggle, setLoggle] = useState(false);
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <>
    {/* <div className="container">
      {loggle ? <Form /> : <SignUp />}
      <br />
      <button onClick={() => setLoggle(!loggle)}>Toggle Form</button>
      <br />
      <ProductList />
      </div> */}
    <Navbar />
    <Routes>
      <Route path="/" element={<><Slider /> <ProductList /></> } />
      <Route path="about" element={<About />} />
      <Route path="product/:productId" element={<ProductDetails />} />
      <Route path="admin" element={<Admin />} />
      <Route path="add-product" element={<AddProduct />} />
      <Route path="edit-product/:productId" element={<EditProduct />} />
    </Routes>
    </>
  );
}

export default App;
