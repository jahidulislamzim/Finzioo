import { useCallback } from 'react';
import { Collections, STATUS } from '../config/constants';
import { generateAccountNumber } from '../utils/generateAccountNumber';
import { generateUniqueId } from '../utils/generateUniqueId';

const useAccounts = (dependencies) => {
  const { getDocument, addDocument, updateDocument, getCollection } = dependencies;

  const addAccount = useCallback(async (account) => {
    // Check for existing account with the same name
    const accounts = await getCollection(Collections.ACCOUNTS);
    const duplicate = accounts.find(
      (a) => a.accountName?.toLowerCase() === account.accountName?.toLowerCase() && a.deletedAt === null
    );

    if (duplicate) {
      return { success: false, message: "An account with this name already exists." };
    }

    const creationDate = new Date();
    const newAccount = {
      ...account,
      accountNumber: generateAccountNumber(creationDate),
      accountId: generateUniqueId('acc'),
      currentBalance: parseFloat(account.initialBalance),
      createdAt: creationDate.toISOString(),
      updatedAt: creationDate.toISOString(),
      deletedAt: null,
    };

    await addDocument(Collections.ACCOUNTS, newAccount);
    return { success: true, message: "Your account was created successfully." };
  }, [addDocument, getCollection]);

  const updateAccount = useCallback(async (updatedAccount) => {
    const accountId = updatedAccount.id;
    const originalAccount = await getDocument(Collections.ACCOUNTS, accountId);

    if (!originalAccount) {
      return { success: false, message: "Account not found" };
    }

    const accounts = await getCollection(Collections.ACCOUNTS);
    const duplicate = accounts.find(
      (a) => a.accountName?.toLowerCase() === updatedAccount.accountName?.toLowerCase() &&
        a.id !== accountId &&
        a.deletedAt === null
    );

    if (duplicate) {
      return { success: false, message: "An account with this name already exists." };
    }

    const now = new Date().toISOString();

    updatedAccount.currentBalance = parseFloat(updatedAccount.currentBalance) || parseFloat(originalAccount.currentBalance) || 0;

    if (updatedAccount.initialBalance !== undefined && updatedAccount.initialBalance !== originalAccount.initialBalance) {
      const initialBalanceDiff = (parseFloat(updatedAccount.initialBalance) || 0) - (parseFloat(originalAccount.initialBalance) || 0);

      updatedAccount.currentBalance = (parseFloat(originalAccount.currentBalance) || 0) + initialBalanceDiff;
    }

    const { id, ...accountData } = updatedAccount;
    accountData.updatedAt = now;

    await updateDocument(Collections.ACCOUNTS, accountId, accountData);
    return { success: true, message: "Your account was updated successfully." };
  }, [getDocument, updateDocument, getCollection]);

  const deleteAccount = useCallback(async (id) => {
    const account = await getDocument(Collections.ACCOUNTS, id);

    if (!account) {
      return { success: false, message: "Account not found" };
    }

    if (account.currentBalance > 0) {
      return { success: false, message: "Cannot delete account with balance" };
    }

    const now = new Date().toISOString();
    const { id: _, ...accountData } = account;

    accountData.updatedAt = now;
    accountData.deletedAt = now;
    accountData.status = STATUS.CLOSED;

    await updateDocument(Collections.ACCOUNTS, id, accountData);

    return { success: true, message: "Account deleted successfully." };
  }, [getDocument, updateDocument]);




  return { addAccount, updateAccount, deleteAccount };
};

export default useAccounts;