import React, { useState } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { formatDate } from '../../utils/formatDate';
import { formatAccountNumber } from '../../utils/formatAccountNumber';
import useAppContext from '../../hooks/useAppContext';
import toast from '../Toast/Toast';
import alert from '../Alert/Alert';
import './TransactionDetailsModal.scss';

const TransactionDetailsModal = ({ transaction, onClose, accounts, categories, loans, onDeleteSuccess }) => {
  const { deleteTransaction, formatCurrency } = useAppContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    alert.show({
      title: 'Are you sure?',
      text: "This transaction will be permanently deleted!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsDeleting(true);
        try {
          await deleteTransaction(transaction.id);
          toast.success('Transaction deleted successfully.');
          if (onDeleteSuccess) {
            onDeleteSuccess();
          }
          onClose();
        } catch (err) {
          console.error('Failed to delete transaction:', err);
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  if (!transaction) {
    return null;
  }

  const {
    transactionId,
    notes,
    amount,
    type,
    categoryId,
    accountId,
    fromAccountId,
    toAccountId,
    loanId,
    isOpeningEntry,
    transactionDate,
    createdAt,
    updatedAt
  } = transaction;

  const getAccountInfo = (accId) => accounts?.find((acc) => acc.accountId === accId) || {};
  const getCategoryInfo = (catId) => categories?.find((cat) => cat.categoryId === catId) || {};
  const getLoanInfo = (lId) => loans?.find((loan) => loan.loanId === lId) || null;

  const loan = getLoanInfo(loanId);

  const cardTypeClass = `transaction-card--${type}`;
  const amountSign = 
    type === 'income' ? '+' :
    type === 'transfer' ? '' :
    type === 'loan' && loan ? (loan?.loanType === 'lent' ? '+' : '-') :
    '-';

  const renderCardContent = () => {
    const account = getAccountInfo(accountId);
    const category = getCategoryInfo(categoryId);
    const fromAccount = getAccountInfo(fromAccountId);
    const toAccount = getAccountInfo(toAccountId);

    const { date: formattedTransactionDate, time: formattedTransactionTime } = formatDate(transactionDate);
    const { date: formattedCreatedAtDate, time: formattedCreatedAtTime } = formatDate(createdAt);
    const { date: formattedUpdatedAtDate, time: formattedUpdatedAtTime } = formatDate(updatedAt);

    return (
      <div className={`transaction-card ${cardTypeClass}`}>
        <div className="card-top">
            <div className="balance-section">
                <span className="balance-label">Amount</span>
                <span className="balance-value">{amountSign} {formatCurrency(amount)}</span>
            </div>
            <div className="account-header-right">
                <div className="account-type-container">
                    <span className="account-type">{type}</span>
                </div>
            </div>
        </div>

        <div className="card-middle">
            { (type === 'income' || type === 'expense') && (
                <>
                    <div className="detail-item">
                        <span className="detail-label">Account</span>
                        <span className="detail-value">{account.accountName || 'N/A'}</span>
                        <span className="detail-sub-value">{account.accountType} - {formatAccountNumber(account.accountNumber)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Category</span>
                        <span className="detail-value">{category.name || 'N/A'}</span>
                    </div>
                </>
            )}
            { type === 'transfer' && (
                <>
                    <div className="detail-item">
                        <span className="detail-label">From</span>
                        <span className="detail-value">{fromAccount.accountName || 'N/A'}</span>
                        <span className="detail-sub-value">{fromAccount.accountType} - {formatAccountNumber(fromAccount.accountNumber)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">To</span>
                        <span className="detail-value">{toAccount.accountName || 'N/A'}</span>
                        <span className="detail-sub-value">{toAccount.accountType} - {formatAccountNumber(toAccount.accountNumber)}</span>
                    </div>
                </>
            )}
            { type === 'loan' && loan && (
                <div className="detail-item">
                    <span className="detail-label">Loan</span>
                    <span className="detail-value">{loan?.personName || 'N/A'}</span>
                    <span className="detail-sub-value">{loan.loanType} - {formatAccountNumber(loan.loanNumber)}</span>
                </div>
            )}
        </div>

        <div className="card-bottom">
            <div className="notes-section">
                <span className="notes-label">Notes</span>
                <span className="notes-value">{notes || 'No description'}</span>
            </div>
        </div>

        <div className="card-footer">
             <div className="transaction-id-section">
                <span className="card-holder-name">Transaction ID</span>
                <span className="card-number">{transactionId}</span>
            </div>
            <div className="timestamps-section">
                <div className="timestamp-item">
                    <span className="timestamp-label">Transaction Date</span>
                    <span className="timestamp-value">{`${formattedTransactionDate} at ${formattedTransactionTime}`}</span>
                </div>
                <div className="timestamp-item">
                    <span className="timestamp-label">Created At</span>
                    <span className="timestamp-value">{`${formattedCreatedAtDate} at ${formattedCreatedAtTime}`}</span>
                </div>
                <div className="timestamp-item">
                    <span className="timestamp-label">Updated At</span>
                    <span className="timestamp-value">{`${formattedUpdatedAtDate} at ${formattedUpdatedAtTime}`}</span>
                </div>
            </div>
        </div>

        {!isOpeningEntry && (
          <div className="modal-footer-actions">
            <Button 
              btnType="delete" 
              onClick={handleDelete} 
              loading={isDeleting}
              className="w-full"
            >
              <i className="fal fa-trash-alt"></i> Delete Transaction
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Modal onClose={onClose}>
      {renderCardContent()}
    </Modal>
  );
};

export default TransactionDetailsModal;
