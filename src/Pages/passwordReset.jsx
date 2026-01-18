import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState(""); // success message
  const [error, setError] = useState(""); // error message
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(""); // store token if needed
  const [username, setUsername] = useState(""); // store username returned

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponseMessage("");
    setToken("");
    setUsername("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/password_reset/",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.success) {
        setResponseMessage(data.message); // "Password reset token generated"
        setToken(data.token);
        setUsername(data.username);
      } else {
        setError("Failed to generate password reset token");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Error sending reset request");
      } else {
        setError("Cannot connect to server");
      }
    } finally {
      setLoading(false);
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
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center mb-2">
            Reset Password
          </h2>
          <h3 className="text-sm text-center mb-6">
            Enter your email to receive a password reset token
          </h3>

          {/* Success / Error */}
          {responseMessage && (
            <div className="bg-green-100 text-green-700 p-2 rounded-md w-3/4 mb-2 text-center">
              {responseMessage}
              <br />
              <span className="font-semibold">Username:</span> {username}
              <br />
              <span className="font-semibold">Token:</span> {token}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded-md w-3/4 mb-2 text-center">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="relative w-3/4 mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C4087]"
            />
            <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-lg" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#070055] text-white py-2 px-8 rounded-lg hover:bg-[#0C4087] transition duration-300 shadow-xl w-3/4"
          >
            {loading ? "Sending..." : "Send Reset Token"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
