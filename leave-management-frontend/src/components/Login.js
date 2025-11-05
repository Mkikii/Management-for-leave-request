import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.name, formData.email, formData.password);
      if (result.success) {
        setMessage('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
        return;
      }
    }
    
    if (result.success) {
      setMessage('Success!');
    } else {
      setMessage(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', margin: '10px 0', padding: '8px' }}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', margin: '10px 0', padding: '8px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '100%', margin: '10px 0', padding: '8px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', margin: '10px 0' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      <button 
        onClick={() => setIsLogin(!isLogin)}
        style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
        <p><strong>Demo Admin:</strong> admin@company.com / admin123</p>
        <p><strong>Demo Employee:</strong> john@company.com / password123</p>
      </div>
    </div>
  );
}

export default Login;