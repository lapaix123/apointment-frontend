// src/pages/nurse/ViewDoctorAvailability.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

const ViewDoctorAvailability = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/doctor/availability');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctor availability', error);
    }
  };

  return (
    <div>
      <NavBar userType="nurse" />
      <div className="flex">
        <SideBar userType="nurse" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Doctor Availability</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor.doctorId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.firstName} {doctor.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.availability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ViewDoctorAvailability;
