import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../components/Modal/Modal';
import LoanForm from '../../components/LoanForm/LoanForm';
import Button from '../../components/Button/Button';
import LoanCard from '../../components/LoanCard/LoanCard';
import LoanDetailsModal from '../../components/LoanDetailsModal/LoanDetailsModal';
import Loader from '../../components/Loader/Loader';
import useAppContext from '../../hooks/useAppContext';
import alert from '../../components/Alert/Alert';
import toast from '../../components/Toast/Toast';
import { Collections } from '../../config/constants';
import './Loans.scss';

const Loans = () => {
  const { getCollection, addLoan, updateLoan, deleteLoan, settings } = useAppContext();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [viewingLoan, setViewingLoan] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCollection(Collections.LOANS);
      setLoans(data || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      // Small artificial delay for premium feel
      setTimeout(() => setLoading(false), 600);
    }
  }, [getCollection]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLoan(null);
  };

  const handleSave = async (formData) => {
    if (editingLoan) {
      const result = await updateLoan({ ...editingLoan, ...formData });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await addLoan(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
    fetchLoans();
    closeModal();
  };

  const handleEdit = (loanId) => {
    const loanToEdit = loans.find(loan => loan.id === loanId || loan.loanId === loanId);
    if (loanToEdit) {
      const formattedLoan = {
        ...loanToEdit,
        dueDate: loanToEdit.dueDate ? new Date(loanToEdit.dueDate).toISOString().split('T')[0] : ''
      };
      setEditingLoan(formattedLoan);
      openModal();
    }
  };

  const handleView = (loanId) => {
    const loanToView = loans.find(loan => loan.id === loanId || loan.loanId === loanId);
    setViewingLoan(loanToView);
  };

  const handleCloseView = () => {
    setViewingLoan(null);
  };

  const handleDelete = async (loanId) => {
    setLoadingId(loanId);
    alert.show({
      title: 'Are you sure?',
      text: "This loan record will be archived!",
      showCancelButton: true,
      confirmButtonText: 'Yes, archive it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const delResult = await deleteLoan(loanId);
        if (delResult.success) {
          toast.success('Loan deleted successfully.');
          fetchLoans();
        } else {
          toast.error(delResult.message || 'Failed to delete loan.');
        }
        setLoadingId(null);
      } else {
        setLoadingId(null);
      }
    });
  };

  if (loading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="loans-page amber-theme">
      <header className="page-header">
        <div className="header-text">
          <h2>Loans & Debts</h2>
          <p className="subtitle">Track your commitments and interpersonal lendings with ease.</p>
        </div>
        <div className="header-actions">
          <Button onClick={openModal} btnType="warning">
            <i className="fas fa-plus"></i> New Loan
          </Button>
        </div>
      </header>

      <div className="loans-content">
        <div className="loans-grid">
          {loans.filter(l => settings.showDeletedAccounts ? true : !l.deletedAt).length > 0 ? (
            loans
              .filter(l => settings.showDeletedAccounts ? true : !l.deletedAt)
              .map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                loadingId={loadingId}
              />
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-handshake"></i>
              <p>No active loans or debts found.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal} title={editingLoan ? "Edit Loan" : "Create New Loan"}>
          <LoanForm 
            onSave={handleSave} 
            onCancel={closeModal} 
            loanToEdit={editingLoan}
          />
        </Modal>
      )}

      {viewingLoan && (
        <LoanDetailsModal 
          loan={viewingLoan} 
          onClose={handleCloseView} 
        />
      )}
    </div>
  );
};

export default Loans;
