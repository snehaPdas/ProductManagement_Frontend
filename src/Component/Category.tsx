import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

interface Category {
  name: string;
  subcategories?: { name: string }[]
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API + "/product/getcategory");
      console.log("Response Data:", response.data); // Check the structure of the response

      // If the response is an object containing 'categories' key, extract it
      const fetchedCategories = Array.isArray(response.data) ? response.data : response.data.categories;
      
      if (fetchedCategories) {
        setCategories(fetchedCategories);
      } else {
        toast.error("Failed to load categories.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  async function addCategory() {
    if (categoryName.trim() === "") {
      toast.error("Category name cannot be empty or just spaces!");
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_API + "/product/category", { name: categoryName });
      fetchCategories();
      setCategoryName("");
      toast.success("Category added successfully!");
    } catch (error: any) {
      console.error("Error adding category:", error);
      if (error.response?.status === 400) {
        toast.error("Category already exists!");
      }
    }
  }

  const addSubCategory = async () => {
    if (!selectedCategory || subCategoryName.trim() === "") {
      toast.error("Subcategory name cannot be empty or just spaces!");
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_API + "/product/subcategory", {
        categoryName: selectedCategory,
        subCategoryName,
      });
      fetchCategories();
      setSubCategoryName("");
      toast.success("Subcategory added successfully!");
    } catch (error: any) {
      console.error("Error adding subcategory:", error);
      if (error.response?.status === 400) {
        toast.error("Subcategory already exists!");
      }
    }
  };

  const handleBack = () => {
    navigate("/productlist");
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-900 text-white p-10 gap-8">
      <button className="bg-[#9199df] hover:bg-blue-500 px-8 py-2 rounded-md self-start absolute left-10" onClick={handleBack}>
        Go Back
      </button>
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">Manage Categories</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white text-lg"
          />
          <button
            onClick={addCategory}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold transition"
          >
            Add Category
          </button>
        </div>

        <div className="mb-6">
          <select
            className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white text-lg"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter subcategory name"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            className="w-full mt-3 px-4 py-2 border rounded-lg bg-gray-700 text-white text-lg"
          />
          <button
            onClick={addSubCategory}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold transition"
          >
            Add Subcategory
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-[400px] h-[450px] overflow-y-auto">
        <h3 className="text-2xl font-semibold mb-3">Category List</h3>
        {categories.length === 0 ? (
          <p className="text-gray-400 text-lg">No categories added.</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((cat, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded-lg text-lg">
                <strong>{cat.name}</strong>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <ul className="mt-1 text-sm text-gray-300 list-disc list-inside pl-4">
                    {cat.subcategories.map((sub, subIndex) => (
                      <li key={subIndex}>{sub.name}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default CategoryManager;
