import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import './Login.scss';

const Login = () => {
  const { handleEmailLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'The email address or password you entered is incorrect. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network connection failed. Please check your internet connection.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      default:
        return 'Authentication failed. Please check your credentials and try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await handleEmailLogin(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="mesh-background">
        <div className="mesh-gradient"></div>
        <div className="glass-shape shape-1"></div>
        <div className="glass-shape shape-2"></div>
      </div>
      
      <div className="login-card-container">
        <div className="premium-glass-card fade-in-up">
          <div className="login-header">
            <div className="brand-logo">
              <i className="fat fa-sparkles"></i>
            </div>
            <h2>Welcome to Finzio</h2>
            <p>Securely sign in to your dashboard</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input 
              label="Email Address"
              type="email" 
              name="email" 
              placeholder="hello@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="input-gap"></div>
            
            <Input 
              label="Password"
              type="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {error && (
              <div className="error-msg fade-in">
                <i className="fat fa-circle-exclamation"></i> {error}
              </div>
            )}

            <button type="submit" className="premium-submit-btn" disabled={loading}>
              <span className="btn-content">
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Authenticating</>
                ) : (
                  <>Sign In <i className="fat fa-arrow-right"></i></>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
