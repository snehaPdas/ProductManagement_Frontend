import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import img from "../assets/machimne.jpeg";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

interface Category {
  name: string;
  subcategories: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
}

const Product: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [productName, setProductName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API + "/product/getcategory");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    const category = categories.find((cat) => cat.name === categoryName);
    setSubCategories(category ? category.subcategories : []);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!productName || !image || !selectedCategory || !selectedSubCategory) {
      toast.error("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("image", image);
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubCategory);

    try {
      await axios.post(import.meta.env.VITE_API + "/product/addproduct", formData);
      toast.success("Product added successfully");
      setProductName("");
      setImage(null);
      setSelectedCategory("");
      setSelectedSubCategory("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleBack = () => {
    navigate("/productlist");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Toaster />
      <div className="w-full max-w-4xl bg-[#585c5255] shadow-lg rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-center text-white mb-8">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
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

            <div className="col-span-2">
              <label className="block text-white font-semibold mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
                }}
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 text-lg"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Category</label>
              <select
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 text-lg"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Subcategory</label>
              <select
                className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-800 text-lg"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory || subCategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="w-full max-w-xs bg-[#455676] text-white py-3 rounded-lg text-lg font-semibold">
              Add Product
            </button>
          </div>
        </form>
        <button className="bg-[#9199df] px-4 py-2 rounded-md mt-4" onClick={handleBack}>Go Back</button>
      </div>
    </div>
  );
};

export default Product;
