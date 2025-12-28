import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // FAKE API RESPONSE
    const fakeResponse = {
      token: "fake-token-123",
      user: {
        role: "admin", // temporary
        email,
      },
    };

    login({
      token: fakeResponse.token,
      role: fakeResponse.user.role,
      user: fakeResponse.user,
    });

    navigate(`/${fakeResponse.user.role}`);
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen">
      <div className="flex h-full">

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-black text-white flex flex-col items-center justify-center">
          <p className="text-4xl">ACAT</p>
          <p>ABET Course Assessment Tool</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col items-center justify-center gap-4">
          <p className="text-2xl font-bold mb-4">Login</p>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your university email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded p-1 w-100"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-1 w-100"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white p-2 rounded"
          >
            Login
          </button>

          <p className="text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </form>
  );
};

export default Login;
