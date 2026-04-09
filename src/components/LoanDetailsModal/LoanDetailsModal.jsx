import React from 'react';
import Modal from '../Modal/Modal';
import { formatAccountNumber } from '../../utils/formatAccountNumber';
import { formatDate } from '../../utils/formatDate';
import './LoanDetailsModal.scss';
import { STATUS, LoanType } from '../../config/constants';
import { calculateTotalWithInterest } from '../../utils/loanCalculations';
import useAppContext from '../../hooks/useAppContext';

const LoanDetailsModal = ({ loan, onClose }) => {
  const { formatCurrency } = useAppContext();
  if (!loan) return null;

  const { date: createdDate, time: createdTime } = formatDate(loan.createdAt);
  const { date: updatedDate, time: updatedTime } = formatDate(loan.updatedAt);
  const { date: dueDateFormatted } = formatDate(loan.dueDate);

  const totalWithInterest = calculateTotalWithInterest(loan.amount, loan.interestRate);
  const outstandingBalance = totalWithInterest - (loan.paidAmount || 0);

  return (
    <Modal isOpen={!!loan} onClose={onClose}>
      <div className="loan-details-card-container">
        <div className="loan-details-card">
          <div className="card-top">
            <div className="amount-section">
              <span className="amount-label">{loan.loanType === LoanType.LENT ? 'Lent Amount' : 'Borrowed Amount'}</span>
              <span className="amount-value">{formatCurrency(loan.amount)}</span>
            </div>
            <div className="status-indicator-container">
              <div className={`status-indicator ${loan.status === STATUS.ACTIVE ? 'active' : 'inactive'}`}></div>
              <span className="loan-status">{loan.status}</span>
            </div>
          </div>

          <div className="card-middle">
            <span className="person-name">{loan.personName}</span>
            <span className="loan-number">{formatAccountNumber(loan.loanNumber)}</span>
          </div>

          <div className="card-bottom">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Loan Type</span>
                <span className="detail-value">{loan.loanType.toUpperCase()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Interest Rate</span>
                <span className="detail-value">{`${loan.interestRate}%`}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Outstanding</span>
                <span className="detail-value">{formatCurrency(totalWithInterest)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Paid Amount</span>
                <span className="detail-value">{formatCurrency(loan.paidAmount || 0)}</span>
              </div>
            </div>
            
            <div className="outstanding-section">
                <span className="detail-label">Remaining Balance</span>
                <span className="detail-value highlighted">{formatCurrency(outstandingBalance)}</span>
            </div>

            <div className="notes-section">
              <span className="detail-label">Notes</span>
              <span className="detail-value">{loan.notes || 'No notes provided'}</span>
            </div>

            <div className="dates-container">
              <div className="detail-item">
                <span className="detail-label">Target Date</span>
                <span className="detail-value">{dueDateFormatted || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created On</span>
                <span className="detail-value">{createdDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoanDetailsModal;
