import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';
import Modal from 'react-modal';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

Modal.setAppElement('#root');

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    startingLocalDateTime: '',
    endingLocalDateTime: '',
    reason: '',
    nurseId: '',
    status: 'SCHEDULED'
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [errors, setErrors] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get('/appointments/all');
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments', error);
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

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/doctor/all');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors', error);
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.patientId) {
      errors.patientId = 'Patient is required';
    }
    if (!form.doctorId) {
      errors.doctorId = 'Doctor is required';
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
      if (isEditMode) {
        await apiClient.put(`/appointments/update/${selectedAppointmentId}`, form);
      } else {
        await apiClient.post('/appointments/create', form);
      }
      fetchAppointments();
      closeModal();
      setForm({
        patientId: '',
        doctorId: '',
        startingLocalDateTime: '',
        endingLocalDateTime: '',
        reason: '',
        nurseId: '',
        status: 'SCHEDULED'
      });
    } catch (error) {
      console.error('Error adding/updating appointment', error);
    }
  };

  const openModal = (appointment = null) => {
    if (appointment) {
      setIsEditMode(true);
      setSelectedAppointmentId(appointment.appointmentId);
      setForm({
        patientId: appointment.patient.patientId,
        doctorId: appointment.doctor.doctorId,
        startingLocalDateTime: appointment.startingLocalDateTime,
        endingLocalDateTime: appointment.endingLocalDateTime,
        reason: appointment.reason,
        nurseId: appointment.registeredBy ? appointment.registeredBy.nurseId : '',
        status: appointment.status
      });
    } else {
      setIsEditMode(false);
      setSelectedAppointmentId(null);
      setForm({
        patientId: '',
        doctorId: '',
        startingLocalDateTime: '',
        endingLocalDateTime: '',
        reason: '',
        nurseId: '',
        status: 'SCHEDULED'
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setForm({
      patientId: '',
      doctorId: '',
      startingLocalDateTime: '',
      endingLocalDateTime: '',
      reason: '',
      nurseId: '',
      status: 'SCHEDULED'
    });
    setErrors({});
  };

  const handleDelete = async (appointmentId) => {
    try {
      await apiClient.delete(`/appointments/delete/${appointmentId}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = appointments.filter((appointment) =>
      appointment.patient.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
      appointment.patient.lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
      appointment.doctor.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
      appointment.doctor.lastName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  return (
    <div>
      <NavBar userType="doctor" />
      <div className="flex">
        <SideBar userType="doctor" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">View Appointments</h1>

          <div className="mb-4 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border rounded"
            />
            <FaSearch className="ml-2 text-gray-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Starting Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ending Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                    <tr key={appointment.appointmentId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctor ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.startingLocalDateTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.endingLocalDateTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openModal(appointment)} className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(appointment.appointmentId)} className="text-red-500 hover:text-red-700 ml-2">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Edit Appointment"
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          >
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Appointment' : 'Register Appointment'}</h2>
              <form onSubmit={handleSubmit}>
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
                    Ending Time
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
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={form.status}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border block w-full"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                  {isEditMode ? 'Update Appointment' : 'Register Appointment'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full p-2 mt-2 bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
              </form>
            </div>
          </Modal>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ViewAppointments;
