import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ userType }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <NavLink to="/profile" activeClassName="underline text-yellow-500" className="text-white">Profile</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" activeClassName="underline text-yellow-500" className="text-white">Dashboard</NavLink>
        </li>
        {userType === 'admin' && (
          <>
            <li>
              <NavLink to="/manage-users" activeClassName="underline text-yellow-500" className="text-white">Manage Users</NavLink>
            </li>
            <li>
              <NavLink to="/system-settings" activeClassName="underline text-yellow-500" className="text-white">System Settings</NavLink>
            </li>
          </>
        )}
        {userType === 'nurse' && (
          <>
            <li>
              <NavLink to="/register-patients" activeClassName="underline text-yellow-500" className="text-white">Register Patients</NavLink>
            </li>
            <li>
              <NavLink to="/manage-appointments" activeClassName="underline text-yellow-500" className="text-white">Manage Appointments</NavLink>
            </li>
          </>
        )}
        {userType === 'doctor' && (
          <>
            <li>
              <NavLink to="/set-availability" activeClassName="underline text-yellow-500" className="text-white">Set Availability</NavLink>
            </li>
            <li>
              <NavLink to="/view-appointments" activeClassName="underline text-yellow-500" className="text-white">View Appointments</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
