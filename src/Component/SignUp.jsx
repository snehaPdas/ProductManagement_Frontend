import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Toaster, toast } from "react-hot-toast";



const Signup = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value })
    
  }

  const submitSignup = async(e) => {
    console.log("checkingg.......")
    e.preventDefault()
    try {
        const response=await axios.post(import.meta.env.VITE_API+"/user/signup",signupData)
        console.log("response issssss",response)
    if(response.status === 200 || response.status === 201)
{
  toast.success("Register successfully")
  navigate("/login")
  
}


    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log("Error response:", error.response.status)

       toast.error("user already exist")
    } else {
        alert("Signup failed. Please try again.");
        console.log("Signup error:", error);
    }
        
    }
  }
   
  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative">
      {/* Floating Background Elements */}
      <div className="absolute w-72 h-72 bg-purple-600 opacity-20 rounded-full top-10 left-10 blur-2xl animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-blue-500 opacity-20 rounded-full bottom-10 right-10 blur-2xl animate-pulse"></div>
  
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
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-lg hover:shadow-purple-500/50"
              required
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-lg hover:shadow-blue-500/50"
              required
            />
          </div>
          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-lg hover:shadow-indigo-500/50"
              required
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-md hover:from-purple-500 hover:to-indigo-500 transition transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
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
