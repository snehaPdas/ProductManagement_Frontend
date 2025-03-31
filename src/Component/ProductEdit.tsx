import { useState, useEffect, useRef } from "react";
import axios from "axios";
import img from "../assets/machimne.jpeg";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  subcategories?: SubCategory[];
}

interface SubCategory {
  _id: string;
  name: string;
}

interface Product {
  pName: string;
  pImage: string;
  category: string;
  subCategory: string;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [productName, setProductName] = useState<string>("");
  const [image, setImage] = useState<File | string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API + "/product/getcategory")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    axios
      .get<Product>(`http://localhost:5000/product/getproduct/${id}`)
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
    const category = categories.find((cat) => cat._id === selectedCategory);
    if (category) {
      setSubCategories(category.subcategories || []);
      setSelectedSubCategory("");
    } else {
      setSubCategories([]);
      setSelectedSubCategory("");
    }
  }, [selectedCategory, categories]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      await axios.put(
        `http://localhost:5000/product/updateproduct/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Product updated successfully!");
      navigate("/productlist");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <Toaster />
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-center mb-8">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <input type="file" onChange={handleImageChange} />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
