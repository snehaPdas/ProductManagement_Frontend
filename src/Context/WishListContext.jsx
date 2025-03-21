import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"
import { Toaster, toast } from "react-hot-toast"


const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
  
    try {
      const response = await axios.get(import.meta.env.VITE_API+"/product/getwishlist");
      console.log("wishlist data",response)
      
      if (Array.isArray(response.data)) {
        setWishlist(response.data);
      } else {
        setWishlist([])
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (product) => {
    try {
      const response = await axios.post(import.meta.env.VITE_API+"/product/addwishlist", { productId: product._id });
      console.log("wishlist added", response);
  
      if (response.data.addwishList) {  
  
        setWishlist((prevWishlist) => [...prevWishlist, response.data.addwishList]); 
       toast.success("Product added to wishlist successfully")
        
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Product already exists in wishlist!");
      }
    }
  };
  
  const removeFromWishlist = async (productId) => {
    console.log("The product ID is", productId);
    try {
      const response = await axios.delete(
        `http://localhost:5000/product/removewishlist/${productId}`
      );
      console.log("Remove Response:", response);
  
      if (response.data.removeWishlist) {  
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item._id !== productId)
        );
        toast.success("Product removed from wishlist!");
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };
  

  return (
    <WishlistContext.Provider value={{ wishlist, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
