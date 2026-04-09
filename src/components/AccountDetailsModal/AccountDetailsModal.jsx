import React from 'react';
import Modal from '../Modal/Modal';
import { formatAccountNumber } from '../../utils/formatAccountNumber';
import { formatDate } from '../../utils/formatDate';
import './AccountDetailsModal.scss';
import { STATUS } from '../../config/constants';
import useAppContext from '../../hooks/useAppContext';

const AccountDetailsModal = ({ account, onClose }) => {
  const { formatCurrency } = useAppContext();
  if (!account) return null;

  const { date: createdDate, time: createdTime } = formatDate(account.createdAt);
  const { date: updatedDate, time: updatedTime } = formatDate(account.updatedAt);
  const { date: deletedDate, time: deletedTime } = formatDate(account.deletedAt);

  return (
    <Modal isOpen={!!account} onClose={onClose}>
      <div className="account-details-card-container">
        <div className="account-details-card">
          <div className="card-top">
            <div className="balance-section">
              <span className="balance-label">Current Balance</span>
              <span className="balance-value">{formatCurrency(account.currentBalance)}</span>
            </div>
            <div className="status-indicator-container">
              <div className={`status-indicator ${account.status === STATUS.ACTIVE ? 'active' : 'inactive'}`}></div>
              <span className="account-status">{account.status}</span>
            </div>
          </div>

          <div className="card-middle">
            <span className="account-name">{account.accountName}</span>
            <span className="account-number">{formatAccountNumber(account.accountNumber)}</span>
          </div>

          <div className="card-bottom">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Account Type</span>
                <span className="detail-value">{account.accountType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Initial Balance</span>
                <span className="detail-value">{formatCurrency(account.initialBalance)}</span>
              </div>
            </div>
            <div className="notes-section">
              <span className="detail-label">Description</span>
              <span className="detail-value">{account.description || 'N/A'}</span>
            </div>
            <div className="dates-container">
              <div className="detail-item">
                <span className="detail-label">Created On</span>
                <span className="detail-value">{createdDate}</span>
                <span className="detail-value">{createdTime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">{updatedDate}</span>
                <span className="detail-value">{updatedTime}</span>
              </div>
              {account.deletedAt && (
                <div className="detail-item">
                  <span className="detail-label">Deleted On</span>
                  <span className="detail-value">{deletedDate}</span>
                  <span className="detail-value">{deletedTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AccountDetailsModal;
