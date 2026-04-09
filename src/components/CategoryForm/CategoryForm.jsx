import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './CategoryForm.scss';
import { TransactionType } from '../../contexts/AppContext';
import { STATUS, Collections } from '../../config/constants';
import useAppContext from '../../hooks/useAppContext';

const CategoryForm = ({ onSave, onCancel, categoryToEdit }) => {
  const { getCollection } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [toggleStatus, setToggleStatus] = useState(categoryToEdit ? categoryToEdit.status === STATUS.ACTIVE ? true : false : true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCollection(Collections.CATEGORIES);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, [getCollection]);


  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setDescription(categoryToEdit.description || '');
      setToggleStatus(categoryToEdit.status === STATUS.ACTIVE ? true : false);
    } else {
      setName('');
      setType('');
      setDescription('');
      setToggleStatus(true);
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sameNameCategory = categories.find(
        (category) => category.name.toLowerCase() === name.toLowerCase() && category.type === type
      );

      if (categoryToEdit === null) {
        if (sameNameCategory && sameNameCategory.deletedAt === null) {
          setError('Category with the same name already exists.');
          return;
        }
      } else {
        if (
          sameNameCategory &&
          sameNameCategory.categoryId !== categoryToEdit.categoryId
        ) {
          setError('Category with the same name already exists.');
          return;
        }
      }

      setError('');

      await onSave({
        ...categoryToEdit,
        name,
        type,
        description,
        status: toggleStatus ? STATUS.ACTIVE : STATUS.INACTIVE,
      });
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = Object.values(TransactionType)
    .filter(
      (transactionType) =>
        transactionType === TransactionType.INCOME ||
        transactionType === TransactionType.EXPENSE
    )
    .map((transactionType) => ({
      value: transactionType,
      label: transactionType.charAt(0).toUpperCase() + transactionType.slice(1),
    }));

  return (
    <div className="add-category-form">
      <form onSubmit={handleSubmit}>
        <Input
          label="Category Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Type"
          type="select"
          placeholder="Select a type"
          options={typeOptions}
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <Input
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="full-width"
        />
        <div className="toggle-switch-group">
          <label>Status</label>
          <Button
            toggleSwitch={true}
            isToggled={toggleStatus}
            onClick={() => setToggleStatus(!toggleStatus)}
          />
        </div>
        <div className="form-actions">
          <Button type="submit" btnType="primary" loading={loading}>
            Save
          </Button>
          <Button type="button" onClick={onCancel} btnType="cancel">
            Cancel
          </Button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CategoryForm;
