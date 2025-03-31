import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [signupData, setSignupData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const { name, email, password } = signupData;

    // Name Validation
    const nameRegex = /^[a-zA-Z\s]+$/;
if (!name.trim()) {
  newErrors.name = "Name is required."; // This will catch empty strings or strings with only spaces
} else if (!nameRegex.test(name.trim())) {
  newErrors.name = "Name must contain only letters and spaces.";
}


    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

    // Password Validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) newErrors.password = "Password is required.";
    else if (!strongPasswordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return; // Stop form submission if validation fails

    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/user/signup`, signupData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Registered successfully");
        navigate("/login");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("User already exists");
      } else {
        alert("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative">
      <Toaster />
      <div className="relative bg-gray-900 p-8 rounded-xl shadow-2xl w-96 border border-gray-700 transform hover:scale-105 transition duration-300">
        <h2 className="text-3xl font-semibold text-center text-white">Sign Up</h2>

        <form onSubmit={submitSignup} className="mt-6">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white"
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-md hover:from-purple-500 hover:to-indigo-500 transition transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
