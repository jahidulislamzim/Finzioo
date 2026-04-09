import React, { useState } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './AccountForm.scss';
import { AccountType, STATUS } from '../../config/constants';

const AccountForm = ({ onSave, accountToEdit, onCancel }) => {
  const [accountName, setAccountName] = useState(accountToEdit ? accountToEdit.accountName : '');
  const [initialBalance, setInitialBalance] = useState(accountToEdit ? accountToEdit.initialBalance : '');
  const [accountType, setAccountType] = useState(accountToEdit ? accountToEdit.accountType : '');
  const [description, setDescription] = useState(accountToEdit ? accountToEdit.description : '');
  const [status, setStatus] = useState(accountToEdit ? accountToEdit.status === STATUS.ACTIVE ? true : false : true);
  const [loading, setIsloading] = useState(false);
  

  const handleSubmit = async (e) => {
    setIsloading(true);
    e.preventDefault();
    try {
      const accountData = {
        accountName,
        initialBalance: parseFloat(initialBalance),
        accountType,
        description,
        status: status ? STATUS.ACTIVE : STATUS.INACTIVE,
      };
      if (accountToEdit) {
        await onSave({ ...accountToEdit, ...accountData });
      } else {
        await onSave(accountData);
      }
    } finally {
      setIsloading(false);
    }
  };

  const handleToggle = () => {
    setStatus(!status);
  };

  const accountTypeOptions = Object.values(AccountType).map((type) => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
  }));
  

  return (
    <div className="account-form">
      {accountToEdit && (
        <div className="account-info">
          <p>A/C: {accountToEdit.accountNumber}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <Input
          label="Account Name"
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        />
        <Input
          label="Initial Balance"
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          required
        />
        <Input
          label="Account Type"
          type="select"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          options={accountTypeOptions}
          placeholder="Select an Account Type"
          required
        />
        <Input
          label="Description"
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="full-width"
        />
        <div className="toggle-switch-group">
          <label>Is Active?</label>
          <Button
            toggleSwitch={true}
            isToggled={status}
            onClick={handleToggle}
          />
        </div>
        <div className="form-actions">
          <Button type="submit" btnType={accountToEdit ? 'update' : 'add'} loading={loading}>
            {accountToEdit ? 'Update Account' : 'Add Account'}
          </Button>
          <Button type="button" onClick={onCancel} btnType="cancel">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
