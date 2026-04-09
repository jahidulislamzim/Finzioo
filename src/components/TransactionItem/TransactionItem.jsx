import React, { useState } from 'react';
import './TransactionItem.scss';
import useAppContext from '../../hooks/useAppContext';
import Button from '../Button/Button';
import TransactionDetailsModal from '../TransactionDetailsModal/TransactionDetailsModal';
import Toast from '../Toast/Toast'


const TransactionItem = ({ transaction, accounts, categories, loans, onDeleteSuccess }) => {
  const { formatCurrency } = useAppContext();
  const {
    notes,
    amount,
    type,
    categoryId,
    accountId,
    fromAccountId,
    toAccountId,
    transactionDate,
  } = transaction;

  const [isDetailsModalOpen, setDetailsIsModalOpen] = useState(false);

  const formattedDate = new Date(transactionDate);
  const day = formattedDate.getDate();
  const month = formattedDate.toLocaleString('default', { month: 'short' });

  const getAccountName = (accId) => {
    if (!accounts) return 'N/A';
    const account = accounts.find((acc) => acc.accountId === accId || acc.id === accId);
    return account ? account.accountName : 'N/A';
  };

  const getCategory = (catId) => {
    if (categories && catId) {
      return categories.find(cat => cat.categoryId === catId || cat.id === catId);
    }
    return null;
  };
  
  const getTransactionTypeDetails = () => {
    if (type === 'transfer') {
      return `Transfer: ${getAccountName(fromAccountId)} → ${getAccountName(toAccountId)}`;
    } else if (accountId) {
      return getAccountName(accountId);
    }
    return '';
  };

  const getIcon = () => {
    if (type === 'transfer') return 'fa-money-transfer';
    if (type === 'loan') return 'fa-hand-holding-dollar';
    const category = getCategory(categoryId);
    return category?.icon || 'fa-receipt';
  };

  return (
    <li className={`transaction-card-item ${type}`}>
      <div className="transaction-date-badge">
        <span className="month">{month}</span>
        <span className="day">{day}</span>
      </div>

      <div className="transaction-main-info">
        <div className="icon-badge">
          <i className={`fal ${getIcon()}`}></i>
        </div>
        <div className="text-details">
          <span className="transaction-notes">{notes || 'No description'}</span>
          <span className="transaction-meta">
            {getTransactionTypeDetails()}
            {categoryId && ` • ${getCategory(categoryId)?.name}`}
          </span>
        </div>
      </div>

      <div className="transaction-amount-section">
        <span className={`amount ${type}`}>
          {type === 'income' ? '+' : type === 'expense' ? '-' : ''}{formatCurrency(amount)}
        </span>
        <div className="item-actions">
          <button className="action-dot" onClick={() => setDetailsIsModalOpen(true)} title="View Details">
            <i className="fal fa-ellipsis-stroke"></i>
          </button>
        </div>
      </div>

      {isDetailsModalOpen && (
        <TransactionDetailsModal 
          transaction={transaction} 
          onClose={() => setDetailsIsModalOpen(false)} 
          accounts={accounts}
          categories={categories}
          loans={loans}
          onDeleteSuccess={onDeleteSuccess}
        />
      )}
    </li>
  );
};

export default TransactionItem;
