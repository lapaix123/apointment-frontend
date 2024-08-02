import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Appointment API
export const getAppointments = () => apiClient.get('/appointments/all');
export const getAppointmentById = (id) => apiClient.get(`/appointments/${id}`);
export const createAppointment = (appointment) => apiClient.post('/appointments/create', appointment);
export const updateAppointment = (id, appointment) => apiClient.put(`/appointments/update/${id}`, appointment);
export const deleteAppointment = (id) => apiClient.delete(`/appointments/delete/${id}`);

// Doctor API
export const getDoctors = () => apiClient.get('/doctor/all');
export const getTotalDoctors = () => apiClient.get('/doctor/total');
export const getDoctorById = (id) => apiClient.get(`/doctor/${id}`);
export const createDoctor = (doctor) => apiClient.post('/doctor/create', doctor);
export const updateDoctor = (id, doctor) => apiClient.put(`/doctor/update/${id}`, doctor);
export const deleteDoctor = (id) => apiClient.delete(`/doctor/delete/${id}`);

// Nurse API
export const getNurses = () => apiClient.get('/nurses/all');
export const getTotalNurses = () => apiClient.get('/nurses/total');
export const getNurseById = (id) => apiClient.get(`/nurses/${id}`);
export const createNurse = (nurse) => apiClient.post('/nurses/create', nurse);
export const updateNurse = (id, nurse) => apiClient.put(`/nurses/update/${id}`, nurse);
export const deleteNurse = (id) => apiClient.delete(`/nurses/delete/${id}`);

// Patient API
export const getPatients = () => apiClient.get('/patients/all');
export const getTotalPatients = () => apiClient.get('/patients/total');
export const getPatientById = (id) => apiClient.get(`/patients/${id}`);
export const createPatient = (patient) => apiClient.post('/patients/create', patient);
export const updatePatient = (id, patient) => apiClient.put(`/patients/update/${id}`, patient);
export const deletePatient = (id) => apiClient.delete(`/patients/delete/${id}`);

// Specialization API
export const getSpecializations = () => apiClient.get('/specializations/all');
export const getSpecializationById = (id) => apiClient.get(`/specializations/${id}`);
export const createSpecialization = (specialization) => apiClient.post('/specializations/create', specialization);
export const updateSpecialization = (id, specialization) => apiClient.put(`/specializations/update/${id}`, specialization);
export const deleteSpecialization = (id) => apiClient.delete(`/specializations/delete/${id}`);

// User API
export const getUsers = () => apiClient.get('/users/all');
export const getTotalUsers = () => apiClient.get('/users/total');
export const getUserById = (id) => apiClient.get(`/users/${id}`);
export const createUser = (user) => apiClient.post('/users/register', user);
export const updateUser = (id, user) => apiClient.put(`/users/update/${id}`, user);
export const deleteUser = (id) => apiClient.delete(`/users/delete/${id}`);
export const loginUser = (email, password) => apiClient.post('/users/login', { email, password });
export const getCurrentUser = () => apiClient.get('/users/current');
export const logoutUser = () => apiClient.post('/users/logout');

export default apiClient;
