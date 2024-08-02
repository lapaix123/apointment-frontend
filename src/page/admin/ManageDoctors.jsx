import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import Modal from 'react-modal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

Modal.setAppElement('#root');

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', contactInfo: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await apiClient.get('/doctor/all');
      setDoctors(response.data);
      setFilteredDoctors(response.data);
      setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching doctors', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await apiClient.put(`/doctor/update/${editDoctorId}`, form);
      } else {
        await apiClient.post('/doctor/create', form);
      }
      fetchDoctors();
      closeModal();
    } catch (error) {
      console.error(editMode ? 'Error updating doctor' : 'Error adding doctor', error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setForm({ firstName: '', lastName: '', email: '', contactInfo: '' });
  };

  const handleEdit = (doctor) => {
    setForm({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      contactInfo: doctor.contactInfo,
    });
    setEditDoctorId(doctor.id);
    setEditMode(true);
    openModal();
  };

  const handleDelete = async (doctorId) => {
    try {
      await apiClient.delete(`/doctor/delete/${doctorId}`);
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = doctors.filter(
      (doctor) =>
        doctor.firstName.toLowerCase().includes(term.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(term.toLowerCase()) ||
        doctor.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredDoctors(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <NavBar userType="admin" />
      <div className="flex">
        <SideBar userType="admin" />
        <main className="flex-1 p-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Manage Doctors</h1>
            <p className="mb-4 text-gray-600">A list of all the doctors in your account including their name, email, and contact info.</p>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-1/3 p-2 border rounded"
              />
              <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded">
                Add New Doctor
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Info</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {currentDoctors.map((doctor) => (
                    <tr key={doctor.id} className="border-b">
                      <td className="px-6 py-4">{doctor.firstName}</td>
                      <td className="px-6 py-4">{doctor.lastName}</td>
                      <td className="px-6 py-4">{doctor.email}</td>
                      <td className="px-6 py-4">{doctor.contactInfo}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(doctor.id)}
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Add Doctor"
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          >
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Doctor' : 'Add Doctor'}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleInputChange}
                  value={form.firstName}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleInputChange}
                  value={form.lastName}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  value={form.email}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="contactInfo"
                  placeholder="Contact Info"
                  onChange={handleInputChange}
                  value={form.contactInfo}
                  className="w-full p-2 mb-4 border rounded"
                />
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                  {editMode ? 'Update Doctor' : 'Add Doctor'}
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

export default ManageDoctors;
