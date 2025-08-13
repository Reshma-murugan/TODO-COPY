import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = ({ 
  filter, 
  setFilter, 
  clearCompleted, 
  completedCount, 
  totalCount 
}) => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/" className="nav-title-link">
            <h1 className="nav-title">My Tasks</h1>
          </Link>
        </div>
        
        <div className="nav-center">
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All ({totalCount || 0})
            </button>
            <button
              className={filter === 'active' ? 'active' : ''}
              onClick={() => setFilter('active')}
            >
              Active ({(totalCount || 0) - (completedCount || 0)})
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedCount || 0})
            </button>
          </div>
        </div>

        <div className="nav-right">
          {(completedCount || 0) > 0 && (
            <button 
              className="clear-completed-btn"
              onClick={clearCompleted}
            >
              Clear Completed
            </button>
          )}
          
          <div className="profile-section" ref={dropdownRef}>
            <button 
              className="profile-button"
              onClick={toggleProfileDropdown}
            >
              <div className="profile-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="profile-username">{user?.username || 'User'}</span>
              <svg 
                className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </button>
            
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-username">{user?.username || 'User'}</div>
                    <div className="dropdown-email">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
                <Link 
                  to="/profile" 
                  className="dropdown-link"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                  View Profile
                </Link>
                <div className="dropdown-divider"></div>
                <button 
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6zM5 3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3z"/>
                    <path d="M11.5 8a.5.5 0 0 1-.5.5H8a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5z"/>
                    <path d="M10.146 7.146a.5.5 0 0 1 .708.708L9.707 8.5l1.147 1.146a.5.5 0 0 1-.708.708L8.793 8.5l1.353-1.354z"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;