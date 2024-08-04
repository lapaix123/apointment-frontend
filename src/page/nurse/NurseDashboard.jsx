import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';
import apiClient from '../../apiService';
import { FaUserMd, FaProcedures, FaCalendarAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const NurseDashboard = () => {
  const [totals, setTotals] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const [doctors, patients, appointments] = await Promise.all([
        apiClient.get('/doctor/total'),
        apiClient.get('/patients/total'),
        apiClient.get('/appointments/total'),
      ]);

      console.log('Doctors Total:', doctors.data.total);
      console.log('Patients Total:', patients.data.total);
      console.log('Appointments Total:', appointments.data.total);

      setTotals({
        doctors: doctors.data.total,
        patients: patients.data.total,
        appointments: appointments.data.total,
      });
    } catch (error) {
      console.error('Error fetching totals', error);
    }
  };

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Appointments',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Doctors',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        backgroundColor: 'rgb(153, 102, 255)',
        borderColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  return (
    <div>
      <NavBar userType="nurse" />
      <div className="flex">
        <SideBar userType="nurse" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Nurse Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaUserMd className="text-3xl text-blue-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.doctors}</h2>
                <p className="text-gray-500">Total Doctors</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaProcedures className="text-3xl text-green-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.patients}</h2>
                <p className="text-gray-500">Total Patients</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaCalendarAlt className="text-3xl text-red-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.appointments}</h2>
                <p className="text-gray-500">Total Appointments</p>
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

export default NurseDashboard;
