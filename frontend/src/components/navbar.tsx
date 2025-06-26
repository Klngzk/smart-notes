import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/authContext";
import { useState } from "react";
import { IoMenuSharp } from "react-icons/io5";
import { BiPlus } from "react-icons/bi";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between flex-wrap bg-white py-4 lg:px-12 shadow border-solid border-t-2 border-blue-700">
      <Link
        to="/"
        className="flex items-center flex-shrink-0 text-gray-800 ml-6"
      >
        <div className="flex items-center flex-shrink-0 text-gray-800 ml-6">
          <span className="font-semibold text-xl tracking-tight">
            Smart Notes
          </span>
        </div>
      </Link>
      {/* Burger icon for small screens */}
      <div className="block sm:hidden mr-6">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center px-3 py-2  rounded-2xl text-blue-700 cursor-pointer hover:text-white hover:bg-blue-700"
        >
          <IoMenuSharp className="h-7 w-7" />
        </button>
      </div>
      {/* Menu */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } w-full sm:flex sm:items-center sm:w-auto sm:space-x-2 mr-6 mt-2 sm:mt-0`}
      >
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/notes/create")}
                className="hidden sm:flex items-center gap-2 text-md px-4 py-2 rounded-3xl cursor-pointer font-semibold text-white bg-green-400 hover:bg-green-300"
              >
                <BiPlus size={20} />
                Add Note
              </button>
              <button
                onClick={handleLogout}
                className="block text-md px-4 py-2 rounded-3xl cursor-pointer font-semibold text-white bg-red-500 hover:bg-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="sm:flex">
              <Link
                to="/login"
                className="block text-md px-4 py-2 m-1 text-center rounded-full text-white cursor-pointer bg-blue-700 font-semibold  hover:bg-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block text-md px-4 py-2 m-1 text-center rounded-full text-white cursor-pointer bg-blue-700 font-semibold  hover:bg-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
