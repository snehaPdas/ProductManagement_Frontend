import { useState, useEffect, useRef } from "react";
import axios from "axios";
import img from "../assets/machimne.jpeg";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [productName, setProductName] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  useEffect(() => {
    // Fetch categories
    axios
      .get(import.meta.env.VITE_API+"/product/getcategory")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch product details
    axios
      .get(`http://localhost:5000/product/getproduct/${id}`)
      .then((response) => {
        const product = response.data;
        setProductName(product.pName);
        setImage(product.pImage);
        setSelectedCategory(product.category);
        setSelectedSubCategory(product.subCategory);
      })
      .catch((error) => console.error("Error fetching product details:", error));
  }, [id]);

  useEffect(() => {
    // Update subcategories when selectedCategory changes
    const category = categories.find((cat) => cat._id === selectedCategory);
    if (category) {
      setSubCategories(category.subcategories || []);
      setSelectedSubCategory(""); // Reset subcategory if category changes
    } else {
      setSubCategories([]);
      setSelectedSubCategory("");
    }
  }, [selectedCategory, categories]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("Selected File:", file); // Debugging log
      setImage(file);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !selectedCategory || !selectedSubCategory) {
      toast.error("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubCategory);

    if (image && image instanceof File) {
        formData.append("image", image);
      }
      console.log("FormData Entries:", [...formData.entries()])


    try {
      await axios.put(`http://localhost:5000/product/updateproduct/${id}`, formData,{
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Product updated successfully!");
      navigate("/productlist");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <Toaster />
      <div className="w-full max-w-4xl bg-[#585c5255] shadow-lg rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="col-span-2">
              <label className="block text-white font-semibold mb-2">Product Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 text-lg"
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-2">
              <label className="block text-white font-semibold mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 text-lg"
              />
              {image && !(image instanceof File) && (
                <img src={image} alt="Current Product" className="mt-4 w-32 h-32 object-cover rounded-md" />
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-white font-semibold mb-2">Category</label>
              <select
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 text-lg"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            <div>
              <label className="block text-white font-semibold mb-2">Subcategory</label>
              <select
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 text-lg"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory || subCategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {subCategories.length > 0 ? (
                  subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No Subcategories Available</option>
                )}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs bg-[#455676] hover:bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold transition"
            >
              Update Product
            </button>
          </div>
        </form>
        <button className="bg-[#9199df] hover:bg-blue-500 px-4 py-2 rounded-md mt-4" onClick={() => navigate("/productlist")}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
