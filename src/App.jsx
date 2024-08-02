import './App.css';
import Login from './page/Login';
import ForgetPassword from './page/ForgetPassword';
import DoctorDashboard from './page/doctor/DoctorDashboard';
import NurseDashboard from './page/nurse/NurseDashboard';
import AdminDashboard from './page/admin/AdminDashboard';
import ManageDoctors from './page/admin/ManageDoctors';
import ManageNurses from './page/admin/ManageNurses';
import ManageUsers from './page/admin/ManageUsers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
        <Route path="/nurse-dashboard" element={<NurseDashboard/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        <Route path="/manage-doctors" element={<ManageDoctors />} />
        <Route path="/manage-nurses" element={<ManageNurses />} />
        <Route path="/manage-users" element={<ManageUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
