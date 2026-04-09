import { useCallback } from 'react';
import { generateUniqueId } from '../utils/generateUniqueId';
import { STATUS, Collections } from '../config/constants';

const useCategories = (dependencies) => {
  const { getDocument, addDocument, updateDocument } = dependencies;

  const addCategory = useCallback(async (category) => {
    const now = new Date().toISOString();
    const newCategory = {
      ...category,
      categoryId: generateUniqueId('CAT'),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    await addDocument(Collections.CATEGORIES, newCategory);
    return { success: true, message: "Category created successfully." };
  }, [addDocument]);

  const updateCategory = useCallback(async (updatedCategory) => {
    const categoryId = updatedCategory.id;
    const originalCategory = await getDocument(Collections.CATEGORIES, categoryId);

    if (!originalCategory) {
      return { success: false, message: "Category not found." };
    }

    const now = new Date().toISOString();
    const { id, ...categoryData } = updatedCategory;
    categoryData.updatedAt = now;

    await updateDocument(Collections.CATEGORIES, categoryId, categoryData);
    return { success: true, message: "Category updated successfully." };
  }, [getDocument, updateDocument]);

  const deleteCategory = useCallback(async (id) => {
    const category = await getDocument(Collections.CATEGORIES, id);

    if (!category) {
      return { success: false, message: "Category not found." };
    }

    const now = new Date().toISOString();
    const { id: _, ...categoryData } = category;

    categoryData.updatedAt = now;
    categoryData.deletedAt = now;
    categoryData.status = STATUS.CLOSED;

    await updateDocument(Collections.CATEGORIES, id, categoryData);
    return { success: true, message: "Category deleted successfully." };
  }, [getDocument, updateDocument]);

  return { 
    addCategory, 
    updateCategory, 
    deleteCategory 
  };
};

export default useCategories;