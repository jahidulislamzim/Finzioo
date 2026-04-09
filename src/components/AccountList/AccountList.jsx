import React from 'react';
import AccountCard from '../AccountCard/AccountCard';
import './AccountList.scss';

const AccountList = ({ accounts, onEdit, onDelete, onView, loadingId }) => {
  return (
    <div className="account-list">
      {accounts.map((account) => (
        <AccountCard
          key={account.accountId}
          account={account}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          loadingId={loadingId}
        />
      ))}
    </div>
  );
};

export default AccountList;
