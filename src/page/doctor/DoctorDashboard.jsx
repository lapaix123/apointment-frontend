import React, { useEffect, useState } from 'react';
import { getAppointmentsTotal, getAppointments } from '../../apiService';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';
import { FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

const DoctorDashboard = () => {
  const [totals, setTotals] = useState({
    completed: 0,
    upcoming: 0,
    total: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [totalAppointments, appointments] = await Promise.all([
        getAppointmentsTotal(),
        getAppointments(),
      ]);

      const completed = appointments.data.filter(app => app.status === 'COMPLETED').length;
      const upcoming = appointments.data.filter(app => app.status === 'UPCOMING').length;

      setTotals({
        completed,
        upcoming,
        total: totalAppointments.data,
      });

      setChartData({
        labels: ['Completed', 'Upcoming', 'Total'],
        datasets: [
          {
            label: 'Appointments',
            data: [completed, upcoming, totalAppointments.data],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  return (
    <div>
      <NavBar userType="doctor" />
      <div className="flex">
        <SideBar userType="doctor" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Doctor Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaCheckCircle className="text-3xl text-green-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.completed}</h2>
                <p className="text-gray-500">Completed Appointments</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaClock className="text-3xl text-yellow-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.upcoming}</h2>
                <p className="text-gray-500">Upcoming Appointments</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaCalendarAlt className="text-3xl text-blue-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totals.total}</h2>
                <p className="text-gray-500">Total Appointments</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Appointments Overview</h2>
            <div className="bg-white shadow rounded-lg p-4">
              <Line data={chartData} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
