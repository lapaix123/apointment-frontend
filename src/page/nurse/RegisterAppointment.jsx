import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';
import Modal from 'react-modal';
import { FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';

Modal.setAppElement('#root');

const RegisterAppointment = () => {
  const [appointments, setAppointments] = useState([]);
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
  const [editMode, setEditMode] = useState(false);
  const [editAppointmentId, setEditAppointmentId] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await apiClient.get('/appointments/all');
      setAppointments(response.data);
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
    const now = new Date();

    if (!form.patientId) {
      errors.patientId = 'Patient is required';
    }
    if (!form.doctorId) {
      errors.doctorId = 'Doctor is required';
    }
    if (!form.startingLocalDateTime) {
      errors.startingLocalDateTime = 'Starting time is required';
    } else if (new Date(form.startingLocalDateTime) <= now) {
      errors.startingLocalDateTime = 'Starting time must be a future date and time';
    }

    if (form.endingLocalDateTime) {
      const start = new Date(form.startingLocalDateTime);
      const end = new Date(form.endingLocalDateTime);
      const threeHoursLater = new Date(start.getTime() + 3 * 60 * 60 * 1000);

      if (end <= start) {
        errors.endingLocalDateTime = 'Ending time must be after starting time';
      } else if (end > threeHoursLater) {
        errors.endingLocalDateTime = 'Ending time cannot be more than 3 hours after starting time';
      }
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
      if (editMode) {
        await apiClient.put(`/appointments/update/${editAppointmentId}`, form);
      } else {
        await apiClient.post('/appointments/create', form);
      }
      fetchAppointments();
      closeModal();
    } catch (error) {
      console.error('Error saving appointment', error);
    }
  };

  const openModal = (appointment = null) => {
    if (appointment) {
      setEditMode(true);
      setEditAppointmentId(appointment.appointmentId);
      setForm({
        patientId: appointment.patient ? appointment.patient.patientId : '',
        doctorId: appointment.doctor ? appointment.doctor.doctorId : '',
        startingLocalDateTime: appointment.startingLocalDateTime,
        endingLocalDateTime: appointment.endingLocalDateTime,
        reason: appointment.reason,
        nurseId: appointment.nurseId,
        status: appointment.status
      });
    } else {
      setEditMode(false);
      setEditAppointmentId(null);
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

  return (
    <div>
      <NavBar userType="nurse" />
      <div className="flex">
        <SideBar userType="nurse" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Register Appointment</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaCalendarAlt className="text-3xl text-red-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{appointments.length}</h2>
                <p className="text-gray-500">Total Appointments</p>
              </div>
            </div>
          </div>

          <button onClick={() => openModal()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
            Add New Appointment
          </button>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                    <tr key={appointment.appointmentId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctor ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.startingLocalDateTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.endingLocalDateTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                        <button
                          onClick={() => openModal(appointment)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.appointmentId)}
                          className="text-red-500 hover:text-red-700"
                        >
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
            contentLabel="Register Appointment"
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          >
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Appointment' : 'Register Appointment'}</h2>
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
                    min={new Date().toISOString().slice(0, 16)}
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
                    min={form.startingLocalDateTime ? new Date(new Date(form.startingLocalDateTime).getTime() + 30 * 60 * 1000).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
                    max={form.startingLocalDateTime ? new Date(new Date(form.startingLocalDateTime).getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16) : null}
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
                  {editMode ? 'Update Appointment' : 'Register Appointment'}
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

export default RegisterAppointment;
