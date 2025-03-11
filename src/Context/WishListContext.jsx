import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/product/getwishlist");
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (product) => {
    try {
      const response = await axios.post("http://localhost:5000/product/addwishlist", { productId: product._id });
      setWishlist(response.data);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/product/removewishlist/${productId}`);
      setWishlist(response.data);
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
