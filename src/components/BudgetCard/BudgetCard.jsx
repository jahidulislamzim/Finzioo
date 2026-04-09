import React, { useState, useEffect } from 'react';
import CircularProgress from '../CircularProgress/CircularProgress';
import Button from '../Button/Button';
import './BudgetCard.scss';
import useAppContext from '../../hooks/useAppContext';
import { Collections } from '../../config/constants';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { getCollection, formatCurrency } = useAppContext();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesData = await getCollection(Collections.CATEGORIES);
        const foundCategory = (categoriesData || []).find(cat => cat.categoryId === budget.categoryId || cat.id === budget.categoryId);
        setCategory(foundCategory);
      } catch (error) {
        console.error("Error fetching category for budget card:", error);
      }
    };
    fetchCategory();
  }, [budget.categoryId, getCollection]);

  const categoryName = category ? category.name : 'General';
  const categoryIcon = category?.icon || 'fa-bullseye';
  const isExceeded = (budget.spent || 0) >= budget.limit;
  const percentage = Math.min(100, Math.floor(((budget.spent || 0) / budget.limit) * 100));
  const remaining = Math.max(0, budget.limit - (budget.spent || 0));
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(budget.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`budget-list-card ${isExceeded ? 'exceeded' : ''}`}>
      <div className="card-header">
        <div className="category-info">
          <div className="category-icon">
            <i className={`fad ${categoryIcon}`}></i>
          </div>
          <div className="category-text">
            <h3 className="name">{categoryName}</h3>
            <span className="status-label">{isExceeded ? 'Budget Exceeded' : 'On Track'}</span>
          </div>
        </div>
        <div className="card-actions">
          <Button
            btnType="edit"
            iconOnly={true}
            onClick={() => onEdit(budget)}
            title="Edit Budget"
          >
            <i className="fal fa-edit"></i>
          </Button>
          <Button
            btnType="delete"
            iconOnly={true}
            onClick={handleDelete}
            loading={isDeleting}
            title="Delete Budget"
          >
            <i className="fal fa-trash-alt"></i>
          </Button>
        </div>
      </div>

      <div className="card-body">
        <div className="progress-section">
          <CircularProgress percentage={percentage} isExceeded={isExceeded} />
          <div className="progress-stats">
            <div className="stat">
              <span className="label">Spent</span>
              <span className="value spent">{formatCurrency(budget.spent || 0)}</span>
            </div>
            <div className="stat">
              <span className="label">Limit</span>
              <span className="value limit">{formatCurrency(budget.limit)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="remaining-info">
          <span className="label">Remaining</span>
          <span className="value">{formatCurrency(remaining)}</span>
        </div>
        <div className="progress-bar-mini">
          <div className="fill" style={{ width: `${percentage}%`, backgroundColor: isExceeded ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
