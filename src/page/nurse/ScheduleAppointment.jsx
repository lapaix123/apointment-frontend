// src/pages/nurse/ScheduleAppointment.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

const ScheduleAppointment = () => {
  const [form, setForm] = useState({
    doctorId: '',
    patientId: '',
    startingLocalDateTime: '',
    endingLocalDateTime: '',
    reason: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/doctor/all');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get('/patients/all');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients', error);
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.doctorId) {
      errors.doctorId = 'Doctor is required';
    }
    if (!form.patientId) {
      errors.patientId = 'Patient is required';
    }
    if (!form.startingLocalDateTime) {
      errors.startingLocalDateTime = 'Starting time is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await apiClient.post('/appointments/create', form);
      alert('Appointment scheduled successfully');
      setForm({
        doctorId: '',
        patientId: '',
        startingLocalDateTime: '',
        endingLocalDateTime: '',
        reason: '',
      });
    } catch (error) {
      console.error('Error scheduling appointment', error);
    }
  };

  return (
    <div>
      <NavBar userType="nurse" />
      <div className="flex">
        <SideBar userType="nurse" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Schedule Appointment</h1>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-4">
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                Doctor
              </label>
              <select
                name="doctorId"
                id="doctorId"
                value={form.doctorId}
                onChange={handleInputChange}
                className="mt-1 p-2 border block w-full"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    {doctor.firstName} {doctor.lastName}
                  </option>
                ))}
              </select>
              {errors.doctorId && <p className="text-red-500 text-sm mt-1">{errors.doctorId}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                Patient
              </label>
              <select
                name="patientId"
                id="patientId"
                value={form.patientId}
                onChange={handleInputChange}
                className="mt-1 p-2 border block w-full"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
              {errors.patientId && <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="startingLocalDateTime" className="block text-sm font-medium text-gray-700">
                Starting Time
              </label>
              <input
                type="datetime-local"
                name="startingLocalDateTime"
                id="startingLocalDateTime"
                value={form.startingLocalDateTime}
                onChange={handleInputChange}
                className="mt-1 p-2 border block w-full"
              />
              {errors.startingLocalDateTime && <p className="text-red-500 text-sm mt-1">{errors.startingLocalDateTime}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="endingLocalDateTime" className="block text-sm font-medium text-gray-700">
                Ending Time (Optional)
              </label>
              <input
                type="datetime-local"
                name="endingLocalDateTime"
                id="endingLocalDateTime"
                value={form.endingLocalDateTime}
                onChange={handleInputChange}
                className="mt-1 p-2 border block w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason
              </label>
              <input
                type="text"
                name="reason"
                id="reason"
                value={form.reason}
                onChange={handleInputChange}
                className="mt-1 p-2 border block w-full"
              />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
              Schedule Appointment
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ScheduleAppointment;
