import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

export const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  };

  const handleResponse = async (response) => {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return null;
  };

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: getAuthHeaders(),
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
      
      const data = await handleResponse(response);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const get = useCallback((url) => {
    return fetchData(url, { method: 'GET' });
  }, [fetchData]);

  const post = useCallback((url, data) => {
    return fetchData(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [fetchData]);

  const put = useCallback((url, data) => {
    return fetchData(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [fetchData]);

  const del = useCallback((url) => {
    return fetchData(url, { method: 'DELETE' });
  }, [fetchData]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
};