import React from 'react';
import Button from '../Button/Button';
import './LoanCard.scss';
import { calculateTotalWithInterest } from '../../utils/loanCalculations';
import { formatDate } from '../../utils/formatDate';
import { formatAccountNumber } from '../../utils/formatAccountNumber';
import { LoanType } from '../../contexts/AppContext';
import { STATUS } from '../../config/constants';
import useAppContext from '../../hooks/useAppContext';

const LoanCard = ({ loan, onEdit, onDelete, onView, loadingId }) => {
  const { formatCurrency } = useAppContext();
  const {
    id,
    personName,
    amount,
    paidAmount,
    dueDate,
    loanType,
    interestRate,
    notes,
    loanNumber,
    status
  } = loan;

  const totalWithInterest = calculateTotalWithInterest(amount, interestRate);
  const outstandingBalance = totalWithInterest - paidAmount;
  const isClosed = status === STATUS.CLOSED;
  const isLent = loanType === LoanType.LENT;
  const isDeleted = loan.deletedAt !== null && loan.deletedAt !== undefined;

  return (
    <div className={`loan-list-card ${loanType.toLowerCase()} ${isClosed ? 'closed' : ''} ${isDeleted ? 'is-deleted' : ''}`}>
      <div className="card-header">
        <div className="person-identity">
          <div className="person-avatar">
            <i className="fad fa-user-circle"></i>
          </div>
          <div className="person-info">
            <h3 className="name">{personName}</h3>
            <span className="loan-number">{formatAccountNumber(loanNumber)}</span>
          </div>
        </div>
        <div className="loan-status">
          {isDeleted ? (
            <span className="status-pill" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-rose)' }}>
              <i className="fal fa-trash-alt" style={{ marginRight: '4px' }}></i> Deleted
            </span>
          ) : (
            <span className={`status-pill ${status === STATUS.ACTIVE ? 'active' : 'inactive'}`}>
              {isLent ? 'Lent' : 'Borrowed'}
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        <div className="amount-main">
          <span className="label">Principal Amount</span>
          <span className="value">{formatCurrency(amount)}</span>
        </div>
        
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-label">Total to {isLent ? 'Receive' : 'Pay'}</span>
            <span className="stat-value">{formatCurrency(totalWithInterest)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Outstanding</span>
            <span className="stat-value highlight">{formatCurrency(outstandingBalance)}</span>
          </div>
        </div>
      </div>

      {notes && (
        <div className="card-notes">
          <i className="fal fa-sticky-note"></i>
          <p>{notes}</p>
        </div>
      )}

      <div className="card-footer">
        <div className="due-date-info">
          <i className="fal fa-calendar-alt"></i>
          <span>Due: {formatDate(dueDate).date}</span>
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
                onClick={() => onEdit(id)} 
                title="Edit Loan"
              >
                <i className="fal fa-edit"></i>
              </Button>
              <Button 
                btnType="delete" 
                iconOnly={true} 
                onClick={() => onDelete(id)} 
                loading={loadingId === id} 
                title="Archive Loan"
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

export default LoanCard;
