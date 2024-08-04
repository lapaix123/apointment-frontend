import React, { useState, useEffect } from 'react';
import apiClient from '../../apiService';
import NavBar from '../../components/NavBar';
import SideBar from '../../components/SideBar';
import Footer from '../../components/Footer';

const SetAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [form, setForm] = useState({
    doctorId: '', // Should be filled with the logged-in doctor's ID
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await apiClient.get(`/doctor-availability/get/${form.doctorId}`);
      setAvailability(response.data);
    } catch (error) {
      console.error('Error fetching availability', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/doctor-availability/set', form);
      fetchAvailability();
      setForm({
        doctorId: form.doctorId,
        startTime: '',
        endTime: ''
      });
    } catch (error) {
      console.error('Error setting availability', error);
    }
  };

  return (
    <div>
      <NavBar userType="doctor" />
      <div className="flex">
        <SideBar userType="doctor" />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-semibold mb-4">Set Availability</h1>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-4">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                id="startTime"
                value={form.startTime}
                onChange={handleInputChange}
                className="mt-1 p-2 border block w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="datetime-local"
                name="endTime"
                id="endTime"
                value={form.endTime}
                onChange={handleInputChange}
                className="mt-1 p-2 border block w-full"
              />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
              Set Availability
            </button>
          </form>

          <h2 className="text-xl font-semibold mb-4">Current Availability</h2>
          <ul>
            {availability.map((slot) => (
              <li key={slot.id}>
                {slot.startTime} - {slot.endTime}
              </li>
            ))}
          </ul>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SetAvailability;
