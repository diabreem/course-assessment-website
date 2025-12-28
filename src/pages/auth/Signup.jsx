import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // FAKE signup success (API-ready)
    console.log("Signup data:", form);

    // After signup → login
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen">
      <div className="flex h-full">
      
        <div className="w-1/2 bg-black text-white flex flex-col items-center justify-center">
          <p className="text-4xl">ACAT</p>
          <p>ABET Course Assessment Tool</p>
        </div>


        <div className="w-1/2 flex flex-col items-center justify-center gap-4">
          <p className="text-2xl font-bold mb-4">Create Your Account</p>

          <div className="flex gap-2">
            <div className="flex flex-col">
              <label htmlFor="fname" className="text-sm">First Name:</label>
              <input
                type="text"
                id="fname"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded p-1 w-49"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="lname" className="text-sm">Last Name:</label>
              <input
                type="text"
                id="lname"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded p-1 w-49"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your university email"
              value={form.email}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-1 w-100"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded p-1 w-100"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white p-2 rounded"
          >
            Sign up
          </button>

          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Signup;
