import React from "react";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  return (
    <div
      className=" flex items-center justify-center min-h-screen "
      style={{
        backgroundImage: `url('/src/assets/blackgroun.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" wrapper w-[420px] h-[450px] bg-yellow-400 rounded-2xl shadow-lg p-6">
        <form className="">
          <div className="flex justify-center ">
            <div className="rounded-full flex items-center justify-center shadow-2xl bg-white w-20 h-20">
              <img
                src="/src/assets/logoOusl.png"
                alt="OUSL Logo"
                className="logosize object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center mt-0">
            OUSL DISPATCH SYSTEM
          </h2>
          <h3 className="text-sm mb-4 text-center">
            Welcome back! Please login to continue
          </h3>

          <div className="relative flex items-center justify-center mb-3">
            <input
              type="text"
              placeholder="Username"
              required
              className="wdt  margin p-2  w-3/4 border border-gray-300  w1/2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <FaUser className="absolute right-[90px] text-gray-600 text-lg" />
          </div>

          <div className="relative flex items-center justify-center mb-3">
            <input
              type="password"
              placeholder="Password"
              required
              className=" wdt  margin p-2  w-3/4 border border-gray-300  w1/2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
            <FaLock className="absolute right-[90px] text-gray-600 text-lg" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" />
              Remember me
            </label>
            <a href="#" className="text-yellow-700 hover:underline">
              Forgot password?
            </a>
          </div>
          <br />

          <button
            type="submit"
            className=" wdt block mx-auto bg-yellow-700 text-white py-2 px-8 rounded-lg hover:bg-yellow-800 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login

