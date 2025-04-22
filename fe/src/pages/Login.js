import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { amritaEmailRegex, phoneRegex, passwordRegex } from '../utils/regex';

function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { identifier, password } = formData;
    const isEmail = amritaEmailRegex.test(identifier);
    const isPhone = phoneRegex.test(identifier);

    if (!isEmail && !isPhone) {
      setErrors('Please enter a valid Amrita email or 10-digit mobile number.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setErrors('Password must be at least 8 characters with 1 uppercase and 1 number.');
      return;
    }

    alert(`Logged in using ${isEmail ? 'Email' : 'Mobile'}`);
  };

  return (
    <div className="login-bg-2">
      <form className="login-form-2" onSubmit={handleSubmit}>
        <div className="login-avatar">
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="avatar" />
        </div>

        <div className="input-box">
          <FaUser />
          <input
            type="text"
            name="identifier"
            placeholder="Username / Email / Mobile"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <FaLock />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-options">
          <label>
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            /> Remember me
          </label>
          <Link to="/reset-password" className="forgot-link">Forgot Password?</Link>
        </div>

        {errors && <p className="error">{errors}</p>}

        <button type="submit" className="login-button-2">LOGIN</button>
      </form>
    </div>
  );
}

export default Login;
