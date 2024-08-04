import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';
import Modal from 'react-modal';
import { FaProcedures, FaEdit, FaTrash } from 'react-icons/fa';

Modal.setAppElement('#root');

const RegisterPatient = () => {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    nid: '',
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get('/patients/all');
      setPatients(response.data);
      setTotalPatients(response.data.length);
    } catch (error) {
      console.error('Error fetching patients', error);
    }
  };

  const validate = () => {
    const errors = {};

    if (!/^\d{16}$/.test(form.nid)) {
      errors.nid = 'NID must be 16 digits and only contain numbers';
    }

    if (!/^(078|079|073|072)\d{7}$/.test(form.phoneNumber)) {
      errors.phoneNumber = 'Phone number must be 10 digits and start with 078, 079, 073, or 072';
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
        await apiClient.put(`/patients/update/${editPatientId}`, form);
      } else {
        await apiClient.post('/patients/create', form);
      }
      fetchPatients();
      closeModal();
    } catch (error) {
      console.error('Error saving patient', error);
    }
  };

  const openModal = (patient = null) => {
    if (patient) {
      setForm(patient);
      setEditMode(true);
      setEditPatientId(patient.patientId);
    } else {
      setForm({
        nid: '',
        firstName: '',
        lastName: '',
        gender: '',
        phoneNumber: '',
        email: '',
        address: ''
      });
      setEditMode(false);
      setEditPatientId(null);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setErrors({});
  };

  const handleDelete = async (patientId) => {
    try {
      await apiClient.delete(`/patients/delete/${patientId}`);
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.nid.includes(searchTerm) ||
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <NavBar userType="nurse" />
      <div className="flex">
        <SideBar userType="nurse" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Register Patient</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white shadow rounded-lg p-4 flex items-center">
              <FaProcedures className="text-3xl text-blue-500" />
              <div className="ml-4">
                <h2 className="text-xl font-bold">{totalPatients}</h2>
                <p className="text-gray-500">Total Patients</p>
              </div>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 p-2 border rounded w-full"
          />

          <button onClick={() => openModal()} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
            Add New Patient
          </button>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.patientId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.nid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex">
                      <button
                        onClick={() => openModal(patient)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(patient.patientId)}
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
            contentLabel="Register Patient"
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          >
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Patient' : 'Register Patient'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="nid" className="block text-sm font-medium text-gray-700">
                    NID
                  </label>
                  <input
                    type="text"
                    name="nid"
                    id="nid"
                    value={form.nid}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border block w-full"
                  />
                  {errors.nid && <p className="text-red-500 text-sm mt-1">{errors.nid}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border block w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border block w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={form.gender}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border block w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border block w-full"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border block w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={form.address}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border block w-full"
                  />
                </div>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                  {editMode ? 'Update Patient' : 'Register Patient'}
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

export default RegisterPatient;
