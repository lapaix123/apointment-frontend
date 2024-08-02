import React, { useState } from "react";
import { logoutUser } from '../apiService';
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";

const NavBar = ({ userType, userName }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center w-full">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 rounded bg-gray-200 text-black"
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
            <FaUserCircle className="text-white text-2xl" />
            <span className="text-white">{userName}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
              <NavLink
                to="/profile"
                className="flex items-center gap-x-2 px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownOpen(false)}
              >
                <FaCog />
                Profile Settings
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-x-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
