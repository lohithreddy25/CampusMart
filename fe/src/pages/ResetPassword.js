import React, { useState } from 'react';
import './ResetPassword.css';

function ResetPassword() {
  const [form, setForm] = useState({
    identifier: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { identifier, newPassword, confirmPassword } = form;

    if (!identifier) {
      setMessage('Please enter your registered email or mobile number');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password should be at least 8 characters");
      return;
    }

    setMessage("✅ Password reset successfully!");
    // Send to backend later...
  };

  return (
    <div className="reset-bg">
      <form className="reset-form" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <input
          type="text"
          name="identifier"
          placeholder="Email or Mobile"
          value={form.identifier}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {message && <p className="message">{message}</p>}

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
