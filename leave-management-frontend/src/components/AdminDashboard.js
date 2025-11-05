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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <span>Welcome, {user?.name} </span>
          <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </div>

      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Total Requests</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_requests || 0}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Pending</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.pending_requests || 0}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Approved</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.approved_requests || 0}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f8d7da', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Rejected</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.rejected_requests || 0}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#e2e3e5', borderRadius: '5px', textAlign: 'center' }}>
          <h3>Employees</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total_employees || 0}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>All Leave Requests</h2>
        {leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Employee</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Start Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>End Date</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Reason</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{request.employee_name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{request.start_date}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{request.end_date}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{request.reason}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', color: getStatusColor(request.status) }}>
                    {request.status}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {request.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(request.id, 'approved')}
                          style={{ marginRight: '5px', backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(request.id, 'rejected')}
                          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
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

      <div>
        <h2>Employees</h2>
        {users.filter(u => u.role === 'employee').length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role === 'employee').map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
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

export default AdminDashboard;