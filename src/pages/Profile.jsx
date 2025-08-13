import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Profile</h1>
        
        <div className="profile-info">
          <div className="form-group">
            <label>Username</label>
            <div className="profile-value">{user?.username || 'N/A'}</div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <div className="profile-value">{user?.email || 'N/A'}</div>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="auth-button logout-btn"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;