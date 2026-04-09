import React from 'react';
import './AccountCard.scss';
import Button from '../Button/Button';
import { formatAccountNumber } from '../../utils/formatAccountNumber';
import { STATUS } from '../../config/constants';
import useAppContext from '../../hooks/useAppContext';

const AccountCard = ({ account, onEdit, onDelete, onView, loadingId }) => {
  const { formatCurrency } = useAppContext();
  const isClosed = account.status === STATUS.CLOSED;
  const isDeleted = account.deletedAt !== null && account.deletedAt !== undefined;
  const id = account.id || account.accountId;

  const getAccountIcon = (type = '') => {
    switch (type.toLowerCase()) {
      case 'savings': return 'fa-vault';
      case 'checking': return 'fa-money-check-alt';
      case 'credit': return 'fa-credit-card';
      case 'investment': return 'fa-chart-line';
      default: return 'fa-wallet';
    }
  };

  return (
    <div className={`account-list-card ${account.accountType?.toLowerCase() || ''} ${isClosed ? 'closed' : ''} ${isDeleted ? 'is-deleted' : ''}`}>
      <div className="card-top">
        <div className="account-identity">
          <div className="type-icon">
            <i className={`fad ${getAccountIcon(account.accountType)}`}></i>
          </div>
          <div className="account-info">
            <h3 className="account-name">{account.accountName || 'Unnamed Account'}</h3>
            <span className="account-number">{formatAccountNumber(account.accountNumber || '**** **** ****')}</span>
          </div>
        </div>
        <div className="account-status">
          {isDeleted && (
            <span className="status-pill deleted">
              <i className="fal fa-trash-alt"></i> Deleted
            </span>
          )}
          {!isDeleted && (
            <span className={`status-pill ${account.status === STATUS.ACTIVE ? 'active' : 'inactive'}`}>
              {account.status || 'Active'}
            </span>
          )}
        </div>
      </div>

      <div className="card-details">
        <div className="balance-info">
          <span className="label">Current Balance</span>
          <span className="value">{formatCurrency(account.currentBalance)}</span>
        </div>
        
        <div className="card-actions">
          <Button 
            btnType="info" 
            iconOnly={true} 
            onClick={() => onView(id)} 
            title="View Details"
          >
            <i className="fal fa-eye"></i>
          </Button>
          {!isClosed && !isDeleted && (
            <>
              <Button 
                btnType="edit" 
                iconOnly={true} 
                onClick={() => onEdit(account)} 
                title="Edit Account"
              >
                <i className="fal fa-edit"></i>
              </Button>
              <Button 
                btnType="delete" 
                iconOnly={true} 
                onClick={() => onDelete(id)} 
                loading={loadingId === id} 
                title="Archive Account"
              >
                <i className="fal fa-trash-alt"></i>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
