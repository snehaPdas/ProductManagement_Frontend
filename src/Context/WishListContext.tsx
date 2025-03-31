import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  name?: string;
  price?: number;
  description?: string;
  [key: string]: any;
}

interface WishlistContextType {
  wishlist: Product[];
  fetchWishlist: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
}

interface WishlistProviderProps {
  children: ReactNode;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/product/getwishlist`);
      console.log("wishlist data", response);

      if (Array.isArray(response.data)) {
        setWishlist(response.data);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const addToWishlist = async (product: Product) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/product/addwishlist`, { productId: product._id });
      console.log("wishlist added", response);

      if (response.data.addwishList) {
        setWishlist((prevWishlist) => [...prevWishlist, response.data.addwishList]);
        toast.success("Product added to wishlist successfully");
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      if (error.response && error.response.status === 400) {
        toast.error("Product already exists in wishlist!");
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    console.log("The product ID is", productId);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API}/product/removewishlist/${productId}`);
      console.log("Remove Response:", response);

      if (response.data.removeWishlist) {
        setWishlist((prevWishlist) => prevWishlist.filter((item) => item._id !== productId));
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
