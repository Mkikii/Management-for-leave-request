import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function EmployeeDashboard() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/leaves');
      setLeaveRequests(response.data);
    } catch (error) {
      setMessage('Error fetching leave requests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      await axios.post('http://localhost:5000/leaves', formData);
      setMessage('Leave request submitted successfully!');
      setFormData({ start_date: '', end_date: '', reason: '' });
      fetchLeaveRequests();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error submitting request');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'orange';
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Employee Dashboard</h1>
        <div>
          <span>Welcome, {user?.name} </span>
          <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Submit Leave Request</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            style={{ padding: '8px' }}
          />
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            style={{ padding: '8px' }}
          />
          <textarea
            name="reason"
            placeholder="Reason for leave"
            value={formData.reason}
            onChange={handleChange}
            required
            rows="4"
            style={{ padding: '8px' }}
          />
          <button type="submit" style={{ padding: '10px' }}>Submit Request</button>
        </form>
        {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      </div>

      <div>
        <h2>My Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Start Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>End Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Reason</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{request.start_date}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{request.end_date}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{request.reason}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', color: getStatusColor(request.status) }}>
                    {request.status}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;