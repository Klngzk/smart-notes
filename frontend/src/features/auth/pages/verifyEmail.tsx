// TODO: Timer for verification link expiration
// TODO: Fix spam toast clicking
// TODO:  show emails
// TODO:  Password forgot

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

const VerifyEmail = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      })
      .catch((error: Error) => {
        setStatus("error");
        setMessage(error.message || "Verification failed.");
      });
  }, [token]);

  return (
    <div className="mt-12 flex items-center justify-center ">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <FiLoader className="mx-auto text-blue-500 animate-spin" size={48} />
            <p className="text-gray-600 mt-6 text-lg">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <FiCheckCircle className="mx-auto text-green-600" size={48} />
            <p className="text-green-700 text-lg font-semibold mt-6 mb-4">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-700 font-bold text-white px-6 py-2 rounded shadow cursor-pointer hover:bg-blue-600 transition"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <FiXCircle className="mx-auto text-red-600" size={48} />
            <p className="text-red-600 text-lg font-semibold mt-6 mb-4">{message}</p>

          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
