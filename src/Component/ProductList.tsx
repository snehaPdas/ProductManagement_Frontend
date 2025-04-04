import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../assets/machine3.avif";
import { Pencil } from "lucide-react";
import { useWishlist } from "../Context/WishListContext";

interface Product {
  _id: string;
  pName: string;
  pImage: string;
  category: string;
  subCategory: string;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 3; 
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API + "/product/getproduct");
        console.log("getting", response);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const handleaddToWishlist = (product: Product) => {
    addToWishlist(product);
    navigate("/wishlist");
  };

  const handleLogout = () => navigate("/login");
  const handleCategory = () => navigate("/category");
  const handleProduct = () => navigate("/product");
  const handlewishlist = () => navigate("/wishlist");

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleEditProduct = (productId: string) => {
    navigate(`/productedit/${productId}`);
  };

  const handleEditCategory = (category: string) => {
    console.log(`Edit category: ${category}`);
  };

  return (
    <div
      className="min-h-screen bg-gray-900 text-white p-6"
      style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-1">Product Management</h1>
        <button className="bg-blue-600 hover:bg-red-500 px-5 py-2 rounded-md text-white shadow-lg" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="space-x-4 mb-6">
        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md" onClick={handleCategory}>
          Add Category
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md" onClick={handleProduct}>
          Add Product
        </button>
        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md" onClick={handlewishlist}>
          Go To WishList
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-700 text-gray-300">
              <th className="p-3">Image</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Subcategory</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product._id} className="border-b border-gray-700">
                <td className="p-3">
                  <img src={product.pImage} alt={product.pName} className="w-24 h-24 rounded-md" />
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    {product.pName}
                    <Pencil
                      className="ml-2 cursor-pointer text-gray-400 hover:text-white"
                      size={16}
                      onClick={() => handleEditProduct(product._id)}
                    />
                  </div>
                </td>

                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    {product.category}
                    <Pencil
                      className="ml-2 cursor-pointer text-gray-400 hover:text-white"
                      size={16}
                      onClick={() => handleEditCategory(product.category)}
                    />
                  </div>
                </td>

                <td className="p-3">{product.subCategory}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleaddToWishlist(product)}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md"
                  >
                    Add to Wishlist
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 mx-1 rounded-md ${currentPage === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">{currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={`px-4 py-2 mx-1 rounded-md ${currentPage === totalPages ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"}`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
