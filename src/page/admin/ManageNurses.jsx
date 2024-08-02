import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import Modal from 'react-modal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

Modal.setAppElement('#root');

const ManageNurses = () => {
  const [nurses, setNurses] = useState([]);
  const [filteredNurses, setFilteredNurses] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', contactInfo: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNurseId, setEditNurseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchNurses();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, nurses]);

  const fetchNurses = async () => {
    try {
      const response = await apiClient.get('/nurse/all');
      setNurses(response.data);
      setFilteredNurses(response.data);
      setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching nurses', error);
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
        await apiClient.put(`/nurse/update/${editNurseId}`, form);
      } else {
        await apiClient.post('/nurse/create', form);
      }
      fetchNurses();
      closeModal();
    } catch (error) {
      console.error(editMode ? 'Error updating nurse' : 'Error adding nurse', error);
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

  const handleEdit = (nurse) => {
    setForm({
      firstName: nurse.firstName,
      lastName: nurse.lastName,
      email: nurse.email,
      contactInfo: nurse.contactInfo,
    });
    setEditNurseId(nurse.id);
    setEditMode(true);
    openModal();
  };

  const handleDelete = async (nurseId) => {
    try {
      await apiClient.delete(`/nurse/delete/${nurseId}`);
      fetchNurses();
    } catch (error) {
      console.error('Error deleting nurse', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = nurses.filter(
      (nurse) =>
        nurse.firstName.toLowerCase().includes(term.toLowerCase()) ||
        nurse.lastName.toLowerCase().includes(term.toLowerCase()) ||
        nurse.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredNurses(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const currentNurses = filteredNurses.slice(
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
            <h1 className="text-2xl font-bold mb-4">Manage Nurses</h1>
            <p className="mb-4 text-gray-600">A list of all the nurses in your account including their name, email, and contact info.</p>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search nurses..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-1/3 p-2 border rounded"
              />
              <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded">
                Add New Nurse
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
                  {currentNurses.map((nurse) => (
                    <tr key={nurse.id} className="border-b">
                      <td className="px-6 py-4">{nurse.firstName}</td>
                      <td className="px-6 py-4">{nurse.lastName}</td>
                      <td className="px-6 py-4">{nurse.email}</td>
                      <td className="px-6 py-4">{nurse.contactInfo}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(nurse)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(nurse.id)}
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
            contentLabel="Add Nurse"
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          >
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Nurse' : 'Add Nurse'}</h2>
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
                  {editMode ? 'Update Nurse' : 'Add Nurse'}
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

export default ManageNurses;
