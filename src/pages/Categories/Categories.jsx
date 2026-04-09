import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import CategoryForm from '../../components/CategoryForm/CategoryForm';
import CategoryItem from '../../components/CategoryItem/CategoryItem';
import Loader from '../../components/Loader/Loader';
import useAppContext from '../../hooks/useAppContext';
import { Collections } from '../../config/constants';
import alert from '../../components/Alert/Alert';
import './Categories.scss';

const Categories = () => {
  const { addCategory, updateCategory, deleteCategory, getCollection, settings } = useAppContext();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCategories = await getCollection(Collections.CATEGORIES);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      // Artificial delay for premium feel
      setTimeout(() => setLoading(false), 600);
    }
  }, [getCollection]);

  useEffect(() => {
    if (getCollection) {
      loadCategories();
    }
  }, [getCollection, loadCategories]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (category) => {
    if (editingCategory) {
      await updateCategory(category);
    } else {
      await addCategory(category);
    }
    loadCategories();
    handleCloseModal();
  };

  const handleDeleteCategory = async (categoryId) => {
    alert.show({
      title: 'Are you sure?',
      text: "This category will be permanently removed!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategory(categoryId);
        loadCategories();
      }
    });
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    handleOpenModal();
  };

  const categoriesResult = categories
    .filter(category => settings.showDeletedAccounts ? true : category.deletedAt === null)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return <Loader fullScreen={false} />;
  }

  return (
    <div className="categories-page slate-theme">
      <header className="page-header">
        <div className="header-text">
          <h2>Categories</h2>
          <p className="subtitle">Organize your finances with clear, intuitive labels.</p>
        </div>
        <div className="header-actions">
          <Button onClick={() => { setEditingCategory(null); handleOpenModal(); }} btnType="primary">
            <i className="fal fa-plus-circle"></i> New Category
          </Button>
        </div>
      </header>

      <div className="categories-content">
        <div className="categories-grid">
          {categoriesResult.length > 0 ? (
            categoriesResult.map((category) => (
              <CategoryItem 
                key={category.id || category.categoryId} 
                category={category} 
                onEdit={handleOpenEditModal} 
                onDelete={handleDeleteCategory} 
              />
            ))
          ) : (
            <div className="empty-state">
              <i className="fal fa-tags"></i>
              <p>No categories found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={editingCategory ? "Edit Category" : "New Category"}>
          <CategoryForm 
            onSave={handleSaveCategory} 
            onCancel={handleCloseModal} 
            categoryToEdit={editingCategory} 
          />
        </Modal>
      )}
    </div>
  );
};

export default Categories;
