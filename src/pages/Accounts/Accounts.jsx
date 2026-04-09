import React, { useState, useEffect, useCallback } from 'react';
import AccountList from '../../components/AccountList/AccountList';
import AccountForm from '../../components/AccountForm/AccountForm';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import AccountDetailsModal from '../../components/AccountDetailsModal/AccountDetailsModal';
import Loader from '../../components/Loader/Loader';
import useAppContext from '../../hooks/useAppContext';
import Toast from '../../components/Toast/Toast';
import alert from '../../components/Alert/Alert';
import { Collections } from '../../config/constants';
import './Accounts.scss';

const Accounts = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [accountToView, setAccountToView] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const { addAccount, updateAccount, deleteAccount, getCollection, settings } = useAppContext();

  const loadAccounts = useCallback(async () => {
    try {
      const fetchedAccounts = await getCollection(Collections.ACCOUNTS);
      setAccounts(fetchedAccounts);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
      Toast.error("Failed to load accounts.");
    } finally {
      setInitialLoading(false);
    }
  }, [getCollection]);

  useEffect(() => {
    if (getCollection) {
      loadAccounts();
    }
  }, [getCollection, loadAccounts]);

  const accountsResult = accounts
    .filter(account => settings.showDeletedAccounts ? true : account.deletedAt === null)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const handleOpenFormModal = (account = null) => {
    setAccountToEdit(account);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setAccountToEdit(null);
    setIsFormModalOpen(false);
  };

  const handleSave = async (formData) => {
    if (accountToEdit) {
      const result = await updateAccount({ ...accountToEdit, ...formData });
      if (result.success) {
        Toast.success(result.message);
        loadAccounts();
      } else {
        Toast.error(result.message);
      }
    } else {
      const result = await addAccount(formData);
      if (result.success) {
        Toast.success(result.message);
        loadAccounts();
      } else {
        Toast.error(result.message);
      }
    }
    handleCloseFormModal();
  };

  const handleDelete = async (accountId) => {
    setLoadingId(accountId);
    alert.show({
      title: 'Are you sure?',
      text: "This account will be archived!",
      showCancelButton: true,
      confirmButtonText: 'Yes, archive it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteAccountById(accountId);
      } else {
        setLoadingId(null);
      }
    });
  };

  const deleteAccountById = async (accountId) => {
    const result = await deleteAccount(accountId);

    if (result.success) {
      Toast.success(result.message);
      loadAccounts();
    } else {
      Toast.error(result.message);
    }
    setLoadingId(null);
  };

  const handleViewDetails = (accountId) => {
    const account = accounts.find(acc => acc.accountId === accountId || acc.id === accountId);
    setAccountToView(account);
  };

  const handleCloseDetailsModal = () => {
    setAccountToView(null);
  };

  if (initialLoading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="accounts-page azure-theme">
      <header className="page-header">
        <div className="header-text">
          <h2>Accounts</h2>
          <p className="subtitle">Manage and monitor your financial balances effortlessly.</p>
        </div>
        <div className="header-actions">
          <Button onClick={() => handleOpenFormModal()} btnType="primary">
            <i className="fal fa-plus-circle"></i> New Account
          </Button>
        </div>
      </header>

      <div className="accounts-content">
        {accountsResult.length === 0 ? (
          <div className="empty-state">
            <i className="fal fa-university"></i>
            <p>No accounts found. Create a new account to get started.</p>
          </div>
        ) : (
          <AccountList
            accounts={accountsResult}
            onEdit={handleOpenFormModal}
            onDelete={handleDelete}
            onView={handleViewDetails}
            loadingId={loadingId}
          />
        )}
      </div>

      {isFormModalOpen && (
        <Modal onClose={handleCloseFormModal} title={accountToEdit ? "Edit Account" : "Create New Account"}>
          <AccountForm
            onSave={handleSave}
            accountToEdit={accountToEdit}
            onCancel={handleCloseFormModal}
          />
        </Modal>
      )}

      {accountToView && (
        <AccountDetailsModal
          account={accountToView}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default Accounts;
