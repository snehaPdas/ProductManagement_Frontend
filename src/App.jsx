import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
 import Signup from "./Component/SignUp"
 import Login from "./Component/Login"
 import ProductList from "./Component/ProductList"
 import Category from './Component/Category'
 import Product from "./Component/Product"
 import WishList from "./Component/WishList"
 import { Toaster } from 'react-hot-toast';


 import { WishlistProvider } from "./Context/WishListContext";

function App() {
  return (

    <WishlistProvider>
<Toaster />
   <Router>
          <Routes>
          <Route path="/" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/productlist" element={<ProductList/>}/>
          <Route path="/category" element={<Category/>}/>
          <Route path="/Product" element={<Product/>}/>

          <Route path="/wishlist" element={<WishList/>}/>
         
</Routes>
   </Router>
   </WishlistProvider>

  )
}

export default App
