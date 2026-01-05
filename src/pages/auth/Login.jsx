import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as apiLogin } from "../../api/auth";
import { showSnackbar } from "../../utils/snackbar";
import CustomSnackbar from "../../components/CustomSnackbar";
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiLogin(email, password);
      const user = res.data.user;
      login(user);
      navigate(`/${user.role}`);
    } catch (error) {
      showSnackbar(setSnackbar, "Login failed.", "error");

    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-screen">
      <div className="flex h-full">

        <div className="w-1/2 bg-black text-white flex flex-col items-center justify-center">
          <p className="text-4xl">ACAT</p>
          <p>ABET Course Assessment Tool</p>
        </div>

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

        </div>

        <CustomSnackbar
          open={snackbar.open}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          severity={snackbar.severity}
        />

      </div>
    </form>
  );
};

export default Login;
