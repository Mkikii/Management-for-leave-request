import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function AdminDashboard() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [message, setMessage] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchLeaveRequests();
    fetchUsers();
    fetchStats();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/leaves');
      setLeaveRequests(response.data);
    } catch (error) {
      setMessage('Error fetching leave requests');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats');
    }
  };

  const updateStatus = async (leaveId, status) => {
    try {
      await axios.patch(`http://localhost:5000/leaves/${leaveId}/status`, { status });
      setMessage('Status updated successfully!');
      fetchLeaveRequests();
      fetchStats();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error updating status');
    }
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
          <h1>Admin Dashboard</h1>
          <div>
            <span>Welcome, {user?.name} </span>
            <button onClick={logout} className="btn btn-primary" style={{ marginLeft: '10px' }}>Logout</button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Requests</h3>
          <div className="number">{stats.total_requests || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <div className="number">{stats.pending_requests || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <div className="number">{stats.approved_requests || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <div className="number">{stats.rejected_requests || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Employees</h3>
          <div className="number">{stats.total_employees || 0}</div>
        </div>
      </div>

      <div className="card">
        <h2>All Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employee_name}</td>
                  <td>{request.start_date}</td>
                  <td>{request.end_date}</td>
                  <td>{request.reason}</td>
                  <td style={{ color: getStatusColor(request.status), fontWeight: 'bold' }}>
                    {request.status}
                  </td>
                  <td>
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    {request.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(request.id, 'approved')}
                          className="btn btn-success"
                          style={{ marginRight: '5px' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(request.id, 'rejected')}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Employees</h2>
        {users.filter(u => u.role === 'employee').length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === 'employee').map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {new Date(user.created_at).toLocaleDateString()}
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

export default AdminDashboard; // Make sure this line exists