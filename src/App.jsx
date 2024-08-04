import './App.css';
import Login from './page/Login';
import ForgetPassword from './page/ForgetPassword';
import DoctorDashboard from './page/doctor/DoctorDashboard';
import NurseDashboard from './page/nurse/NurseDashboard';
import AdminDashboard from './page/admin/AdminDashboard';
import ManageDoctors from './page/admin/ManageDoctors';
import ManageNurses from './page/admin/ManageNurses';
import ManageUsers from './page/admin/ManageUsers';

import RegisterPatient from './page/nurse/RegisterPatient';
import RegisterAppointment from './page/nurse/RegisterAppointment';
import SetAvailability from './page/doctor/SetAvailability';
import ViewAppointments from './page/doctor/ViewAppointments';
import ViewDoctorAvailability from './page/nurse/ViewDoctorAvailability';
import ScheduleAppointment from './page/nurse/ScheduleAppointment';
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
        <Route path="/register-patients" element={<RegisterPatient />} />        
        <Route path="/register-appointment" element={<RegisterAppointment />}/>
        <Route path="/set-availability" element={<SetAvailability />} />
        <Route path="/view-appointments" element={<ViewAppointments />} />
        <Route path="/view-doctor-availability" component={ViewDoctorAvailability} />
        <Route path="/schedule-appointment" component={ScheduleAppointment} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
