import React from 'react';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

const NurseDashboard = () => {
  return (
    <div>
      <NavBar userType="nurse" />
      <div className="flex">
        <SideBar userType="nurse" />
        <main className="flex-1 p-4">
          <h1>Nurse Dashboard</h1>
          {/* Add your content here */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default NurseDashboard;
