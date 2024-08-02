import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserMd, FaUserNurse, FaUsers, FaCog, FaCalendarCheck, FaUserPlus, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const SideBar = ({ userType }) => {
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-6 flex items-center">
        <svg className="size-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-2-2h-2.5a2 2 0 0 0-1.7.9l-1.3 1.7a2 2 0 0 1-1.7.9h-2.5a2 2 0 0 1-1.7-.9l-1.3-1.7a2 2 0 0 0-1.7-.9H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a2 2 0 0 0 1.7-.9l1.3-1.7a2 2 0 0 1 1.7-.9h2.5a2 2 0 0 1 1.7.9l1.3 1.7a2 2 0 0 0 1.7.9H19a2 2 0 0 0 2-2z"/></svg>
        <span className="ml-3 text-2xl font-semibold">Hospital Appointment</span>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          {userType === 'admin' && (
            <>
              <li>
                <NavLink 
                  to="/admin-dashboard" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaChartLine />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/manage-doctors" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaUserMd />
                  Manage Doctors
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/manage-nurses" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaUserNurse />
                  Manage Nurses
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/manage-users" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaUsers />
                  Manage Users
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/system-settings" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaCog />
                  System Settings
                </NavLink>
              </li>
            </>
          )}
          {userType === 'nurse' && (
            <>
              <li>
                <NavLink 
                  to="/nurse-dashboard" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaChartLine />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/register-patients" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaUserPlus />
                  Register Patients
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/manage-appointments" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaCalendarCheck />
                  Manage Appointments
                </NavLink>
              </li>
            </>
          )}
          {userType === 'doctor' && (
            <>
              <li>
                <NavLink 
                  to="/doctor-dashboard" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaChartLine />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/set-availability" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaCalendarAlt />
                  Set Availability
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/view-appointments" 
                  className={({ isActive }) => isActive ? "flex items-center gap-3 py-2 px-4 text-sm font-medium text-blue-500 bg-gray-700 rounded-lg" : "flex items-center gap-3 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 rounded-lg"}
                >
                  <FaCalendarCheck />
                  View Appointments
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
