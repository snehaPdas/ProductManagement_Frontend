import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { Toaster, toast } from "react-hot-toast";

interface LoginData {
    email: string;
    password: string;
}

function Login() {
    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: ""
    })

    const navigate = useNavigate()

    function onChangeData(key: keyof LoginData, value: string) {
        setLoginData(prev => ({ ...prev, [key]: value }))
    }

    console.log("LoginData=>", loginData)

    const loginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            console.log("entered")

            const response = await axios.post(import.meta.env.VITE_API + "/user/login", loginData)
            console.log(response)
            if (response.status === 200) {
                toast.success("Login successful");
                navigate("/productlist")
            }

        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                console.log("Error response:", error.response.status)
                toast.error("user not exist")
            } else {
                console.log("login error:", error);
            }
        }
    }

    return (
        <section className="bg-gray-800 h-screen pt-[10%] relative flex items-center justify-center">
            <div className="top-blue w-[250px] h-[250px] bg-blue-400 rounded-full absolute top-[10%] left-[50%]"></div>
            <Toaster />
            <div className="bottom-pink w-[280px] h-[280px] bg-pink-400 rounded-full absolute top-[50%] left-[12%] lg:left-[30%]"></div>
            <div className="top-orange w-[300px] h-[300px] bg-orange-400 rounded-full absolute top-[5%] left-[5%] md:left-[23%] lg:left-[30%]"></div>

            <div
                className="container w-[350px] sm:w-[350px] m-auto text-center p-8 text-white z-10 rounded-lg"
                style={{ backdropFilter: "blur(20px)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            >
                <img
                    id="passport"
                    src="https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png"
                    alt="User Avatar"
                    className="mx-auto w-24 h-24 rounded-full"
                />
                <p className="text-xl sm:text-2xl mt-4">Login Here</p>
                <hr className="my-4 border-gray-400" />

                <form onSubmit={loginSubmit}>
                    <input
                        type="email"
                        id="username"
                        onChange={(e) => onChangeData("email", e.target.value)}
                        placeholder="email"
                        className="w-full px-4 py-2 mt-2 text-base sm:text-lg bg-gray-700 rounded-lg outline-none"
                    />
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => onChangeData("password", e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2 mt-4 text-base sm:text-lg bg-gray-700 rounded-lg outline-none"
                    />
                    <button
                        type="submit"
                        className="p-2 mt-6 sm:text-lg bg-blue-500 rounded-2xl w-36 mx-auto sm:w-48 hover:bg-gradient-to-r hover:from-orange-500 hover:via-pink-500 hover:to-pink-700"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-4">
                    If you're new here, click to <a href="/" className="underline hover:text-pink-300">Sign Up</a>
                </p>
            </div>
        </section>
    );
}

export default Login;
