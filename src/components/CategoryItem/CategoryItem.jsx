import React, { useState } from 'react';
import Button from '../Button/Button';
import { STATUS } from '../../config/constants';
import './CategoryItem.scss';

const CategoryItem = ({ category, onEdit, onDelete }) => {
  const { name, type, description, status, icon, id, categoryId } = category;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(id || categoryId);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDeleted = category.deletedAt !== null && category.deletedAt !== undefined;

  return (
    <div className={`category-card ${type.toLowerCase()} ${isDeleted ? 'is-deleted' : ''}`}>
      <div className="card-top">
        <div className="category-icon-badge">
          <i className={`fad ${icon || 'fa-tag'}`}></i>
        </div>
        <div className="category-badges">
          <span className={`type-badge ${type.toLowerCase()}`}>{type}</span>
          <span className={`status-badge ${status === STATUS.ACTIVE ? 'active' : 'inactive'}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="card-content">
        <h3 className="category-name">{name}</h3>
        {description && <p className="category-description">{description}</p>}
      </div>

      <div className="card-actions">
        {isDeleted ? (
          <span className="status-badge" style={{ color: 'var(--accent-rose)', fontWeight: 'bold' }}>
            <i className="fal fa-trash-alt"></i> Deleted
          </span>
        ) : (
          <>
            <Button 
              btnType="edit" 
              iconOnly={true} 
              onClick={() => onEdit(category)}
              title="Edit Category"
            >
              <i className="fal fa-edit"></i>
            </Button>
            <Button 
              btnType="delete" 
              iconOnly={true} 
              onClick={handleDelete}
              title="Delete Category"
              loading={isDeleting}
            >
              <i className="fal fa-trash-alt"></i>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryItem;
