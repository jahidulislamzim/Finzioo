import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import useAppContext from '../../hooks/useAppContext';
import toast from '../../components/Toast/Toast';
import './Profile.scss';

const Profile = () => {
  const { settings, updateSettings } = useAppContext();
  const [formData, setFormData] = useState({
    userName: settings.userName || '',
    userEmail: settings.userEmail || '',
    currency: settings.currency || '$',
    showDeletedAccounts: settings.showDeletedAccounts || false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const currencies = [
    { symbol: '$', label: 'US Dollar', code: 'USD' },
    { symbol: '৳', label: 'Taka', code: 'BDT' },
    { symbol: '€', label: 'Euro', code: 'EUR' },
    { symbol: '£', label: 'Pound', code: 'GBP' },
    { symbol: '₹', label: 'Rupee', code: 'INR' },
    { symbol: '¥', label: 'Yen', code: 'JPY' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCurrencySelect = (symbol) => {
    setFormData(prev => ({ ...prev, currency: symbol }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      toast.success('Settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page purple-theme">
      <header className="page-header">
        <div className="header-text">
          <h2>User Profile</h2>
          <p className="subtitle">Manage your personal information and global preferences.</p>
        </div>
      </header>

      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="settings-section">
            <div className="section-title">
              <i className="fad fa-user-circle"></i>
              <h3>Account Information</h3>
            </div>
            
            <div className="input-grid">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <i className="fal fa-user"></i>
                  <input 
                    type="text" 
                    name="userName" 
                    value={formData.userName} 
                    onChange={handleInputChange} 
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <i className="fal fa-envelope"></i>
                  <input 
                    type="email" 
                    name="userEmail" 
                    value={formData.userEmail} 
                    onChange={handleInputChange} 
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-title">
              <i className="fad fa-money-bill-wave"></i>
              <h3>Financial Preferences</h3>
            </div>
            
            <label className="group-label">Primary Currency</label>
            <div className="currency-grid">
              {currencies.map((curr) => (
                <div 
                  key={curr.code} 
                  className={`currency-card ${formData.currency === curr.symbol ? 'active' : ''}`}
                  onClick={() => handleCurrencySelect(curr.symbol)}
                >
                  <span className="curr-symbol">{curr.symbol}</span>
                  <div className="curr-info">
                    <span className="curr-code">{curr.code}</span>
                    <span className="curr-label">{curr.label}</span>
                  </div>
                  {formData.currency === curr.symbol && (
                    <div className="active-check">
                      <i className="fas fa-check-circle"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data Management Section */}
          <div className="settings-section">
            <div className="section-title">
              <i className="fad fa-database"></i>
              <h3>Data Management</h3>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <span className="toggle-label">
                  <i className="fal fa-trash-restore"></i> Show Deleted Accounts
                </span>
                <span className="toggle-desc">
                  Display archived and deleted accounts in the Accounts list.
                </span>
              </div>
              <label className="toggle-switch-component">
                <input
                  type="checkbox"
                  checked={formData.showDeletedAccounts}
                  onChange={(e) => setFormData(prev => ({ ...prev, showDeletedAccounts: e.target.checked }))}
                />
                <span className="slider round" aria-hidden="true"></span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Button 
              type="submit" 
              btnType="primary" 
              loading={isSaving}
              className="save-btn"
            >
              <i className="fal fa-save"></i> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
