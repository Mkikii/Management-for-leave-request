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
    <div className="container">
      <div className="navbar">
        <div className="navbar-content">
          <h1>Employee Dashboard</h1>
          <div>
            <span>Welcome, {user?.name} </span>
            <button onClick={logout} className="btn btn-primary" style={{ marginLeft: '10px' }}>Logout</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Submit Leave Request</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
          <div className="form-group">
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="reason"
              placeholder="Reason for leave"
              value={formData.reason}
              onChange={handleChange}
              required
              rows="4"
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit Request</button>
        </form>
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="card">
        <h2>My Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.start_date}</td>
                  <td>{request.end_date}</td>
                  <td>{request.reason}</td>
                  <td style={{ color: getStatusColor(request.status), fontWeight: 'bold' }}>
                    {request.status}
                  </td>
                  <td>
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