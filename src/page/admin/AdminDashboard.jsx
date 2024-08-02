import React from 'react';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  return (
    <div>
      <NavBar userType="admin" />
      <div className="flex">
        <SideBar userType="admin" />
        <main className="flex-1 p-4">
          <h1>Admin Dashboard</h1>
          {/* Add your content here */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
