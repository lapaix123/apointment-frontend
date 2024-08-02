import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import Modal from 'react-modal';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '../../components/Pagination';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

Modal.setAppElement('#root');

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', role: 'USER' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users/all');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching users', error);
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
        await apiClient.put(`/users/update/${editUserId}`, form);
      } else {
        await apiClient.post('/users/create', form);
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error(editMode ? 'Error updating user' : 'Error adding user', error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setForm({ email: '', password: '', role: 'USER' });
  };

  const handleEdit = (user) => {
    setForm({
      email: user.email,
      password: '',
      role: user.role,
    });
    setEditUserId(user.id);
    setEditMode(true);
    openModal();
  };

  const handleDelete = async (userId) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const currentUsers = filteredUsers.slice(
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
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <p className="mb-4 text-gray-600">A list of all the users in your account including their email and role.</p>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-1/3 p-2 border rounded"
              />
              <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded">
                Add New User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {currentUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
            contentLabel="Add User"
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
          >
            <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit User' : 'Add User'}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  value={form.email}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleInputChange}
                  value={form.password}
                  className="w-full p-2 mb-2 border rounded"
                />
                <select
                  name="role"
                  onChange={handleInputChange}
                  value={form.role}
                  className="w-full p-2 mb-4 border rounded"
                >
                  <option value="USER">User</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                  {editMode ? 'Update User' : 'Add User'}
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

export default ManageUsers;
