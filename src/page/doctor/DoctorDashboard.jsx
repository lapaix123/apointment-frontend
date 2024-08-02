import React from 'react';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

const DoctorDashboard = () => {
  return (
    <div>
      <NavBar userType="doctor" />
      <div className="flex">
        <SideBar userType="doctor" />
        <main className="flex-1 p-4">
          <h1>Doctor Dashboard</h1>
          {/* Add your content here */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;
