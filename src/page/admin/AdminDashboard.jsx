import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';
import apiClient from '../../apiService';
import { FaUserMd, FaUserNurse, FaUsers, FaProcedures } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
  const [totals, setTotals] = useState({
    doctors: 0,
    nurses: 0,
    users: 0,
    patients: 0,
  });

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const [doctors, nurses, users, patients] = await Promise.all([
        apiClient.get('/doctor/total'),
        apiClient.get('/nurse/total'),
        apiClient.get('/users/total'),
        apiClient.get('/patients/total'),
      ]);

      setTotals({
        doctors: doctors.data,
        nurses: nurses.data,
        users: users.data,
        patients: patients.data,
      });
    } catch (error) {
      console.error('Error fetching totals', error);
    }
  };

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'System Performance',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div>
      <NavBar userType="admin" />
      <div className="flex">
        <SideBar userType="admin" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaUserMd className="text-3xl text-blue-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.doctors}</h2>
                <p className="text-gray-500">Total Doctors</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaUserNurse className="text-3xl text-green-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.nurses}</h2>
                <p className="text-gray-500">Total Nurses</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaUsers className="text-3xl text-purple-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.users}</h2>
                <p className="text-gray-500">Total Users</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaProcedures className="text-3xl text-red-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.patients}</h2>
                <p className="text-gray-500">Total Patients</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">System Performance</h2>
            <div className="bg-white shadow rounded-lg p-4">
              <Line data={data} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
