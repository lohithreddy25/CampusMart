import React, { useState } from 'react';
import './Register.css';
import { amritaEmailRegex, phoneRegex, passwordRegex, usernameRegex } from '../utils/regex';

function Register() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    room: '',
    block: ''
  });

  const [error, setError] = useState('');
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, phone, username, password, confirmPassword, room, block } = form;

    if (!amritaEmailRegex.test(email)) {
      setError('Invalid Amrita email format.');
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError('Invalid 10-digit phone number.');
      return;
    }

    if (!usernameRegex.test(username)) {
      setError('Username must be 3-20 characters, no symbols.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters, 1 uppercase, 1 number.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    if (!room || !block) {
      setError('Please enter both room number and hostel block.');
      return;
    }

    // ✅ BACKEND: Send this `form` data to the server for registration
    // Example (with Axios): axios.post('/api/register', form).then(...)

    alert('Registration successful!');
  };

  return (
    <div className="register-bg">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>USER REGISTRATION</h2>

        <input type="text" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />
        <input type="text" name="room" placeholder="Room Number" value={form.room} onChange={handleChange} required />
        <input type="text" name="block" placeholder="Hostel Block" value={form.block} onChange={handleChange} required />

        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
