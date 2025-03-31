import React, { useEffect, useState } from "react";
import { useWishlist } from "../Context/WishListContext";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define types for the product
interface Product {
  _id: string;
  productId?: {
    pName: string;
    pImage: string;
  };
}

// Define types for the WishlistContext
interface WishlistContextType {
  wishlist: Product[];
  fetchWishlist: () => void;
  removeFromWishlist: (id: string) => void;
}

function WishList() {
  const { wishlist, fetchWishlist, removeFromWishlist } = useWishlist() as WishlistContextType;
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    console.log("Updated wishlist:", wishlist);
  }, [wishlist]);

  // Pagination Logic
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWishlist = wishlist.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Toaster />
      <h1 className="text-3xl font-bold text-center mb-6">My Wishlist</h1>
 
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-400">Your wishlist is empty.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {currentWishlist.map((product: Product) => (
              <div key={product._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="w-full h-70 flex justify-center items-center bg-black">
                  <img 
                    src={product.productId?.pImage || ''} 
                    alt={product.productId?.pName || 'Product Image'} 
                    className="max-h-full max-w-full rounded-md"
                  />
                </div>
                <h2 className="text-xl font-semibold mt-3">{product.productId?.pName}</h2>

                <div className="flex justify-between mt-4">
                  <button
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md"
                    onClick={() => navigate("/productlist")}
                  >
                    Browse Products details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-20 space-x-10">
            <button
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"}`}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-lg font-semibold">Page {currentPage} of {totalPages}</span>
            <button
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-600 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"}`}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WishList;
