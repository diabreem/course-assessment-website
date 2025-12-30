import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { resetPassword, updatePassword } from "../api/auth";

const Account = () => {
  const {auth} = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");


  const handleResetPassword = async () => {
    const [message, setMessage] = useState("");
    try{
      const res = await resetPassword(auth?.user?.email);
      setMessage(res.data.message);
    }
    catch (error){
      setMessage(error.response?.data?.message);
    }
  }

  const handlePasswordUpdate = async () => {
    const [message, setMessage] = useState("");
    try{
      const res = await updatePassword(currentPass, newPass);
      setMessage(res.data.message);
    }
    catch (error){
      setMessage(error.response?.data?.message);
    }
    
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Your Account</p>
        <p className="text-md">View your account information and manage your password.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
        {/* Profile */}
        <div className="flex gap-4 items-center">
          <div className="bg-gray-200 w-12 h-12 flex items-center justify-center rounded-full">
            <i className="fa-solid fa-user text-lg text-(--primary-color)"></i>
          </div>
          <div>
            <p className="font-semibold">
              {auth?.user?.first_name} {auth?.user?.last_name}
            </p>
            <p className="text-sm text-gray-500">{auth?.role.toUpperCase()}</p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">First Name</p>
            <p className="font-medium">{auth?.user?.first_name}</p>
          </div>

          <div>
            <p className="text-gray-500">Last Name</p>
            <p className="font-medium">{auth?.user?.last_name}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{auth?.user?.email}</p>
          </div>

          {/* Password Section */}
          <div className="space-y-2">
            <p className="text-gray-500">Password</p>
            <p className="font-medium">••••••••</p>

            <p className="text-xs text-gray-500">
              ⚠️ You received your initial password by email.  
              Please update it after first login.
            </p>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-sm text-(--primary-color) underline"
              >
                Update password
              </button>

              <button
                onClick={handleResetPassword}
                className="text-sm text-gray-600 underline"
              >
                Reset via email
              </button>
            </div>

            {showPasswordForm && (
              <div className="mt-2 space-y-2 max-w-xs">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPass}
                  onChange={(e) =>
                    setCurrentPass(e.target.value)
                  }
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPass}
                  onChange={(e) =>
                    setNewPass(e.target.value)
                  }
                  className="border rounded px-3 py-2 text-sm w-full"
                />
                <button
                  onClick={handlePasswordUpdate}
                  className="bg-(--primary-color) text-white px-4 py-2 rounded text-sm"
                >
                  Save password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
