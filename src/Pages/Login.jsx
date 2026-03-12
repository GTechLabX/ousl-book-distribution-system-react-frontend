import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/auth";
import { FaUser } from "react-icons/fa";
import { BsEye, BsEyeSlash } from "react-icons/bs";

function Login() {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // The login function sets the user/role in your Auth Context
      await login(username, password);

      // All roles (superadmin, staff, student) go to the same dashboard
      navigate("/dashboard");
      
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url('/src/assets/background1.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-[420px] bg-white rounded-2xl shadow-lg p-6">
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="rounded-full flex items-center justify-center shadow-2xl bg-white w-20 h-20">
              <img
                src="/src/assets/logoOusl.png"
                alt="OUSL Logo"
                className="object-contain w-16 h-16"
              />
            </div>
          </div>

          {/* Titles */}
          <h2 className="text-2xl font-bold text-center mb-2">
            OUSL DISPATCH SYSTEM
          </h2>
          <h3 className="text-sm text-center mb-6">
            Welcome back! Please login to continue
          </h3>

          {/* Error */}
          {error && <p className="text-red-500 mb-2">{error}</p>}

          {/* Username */}
          <div className="relative w-3/4 mb-4">
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-[#0C4087]"
            />
            <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg" />
          </div>

          {/* Password */}
          <div className="relative w-3/4 mb-4">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-md
                         focus:outline-none focus:ring-2 focus:ring-[#0C4087]"
            />
            {show ? (
              <BsEyeSlash
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-gray-600 text-lg cursor-pointer"
                onClick={togglePassword}
              />
            ) : (
              <BsEye
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-gray-600 text-lg cursor-pointer"
                onClick={togglePassword}
              />
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between w-3/4 text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" />
              Remember me
            </label>
            <a href="/password-reset" className="hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-[#070055] text-white py-2 px-8 rounded-lg
                       hover:bg-[#0C4087] transition duration-300
                       shadow-xl w-3/4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;