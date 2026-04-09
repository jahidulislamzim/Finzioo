import { useState, useCallback, useEffect, useRef } from 'react';
import useAppContext from './useAppContext';

/**
 * Custom hook for Firestore pagination
 * @param {string} collectionName - Name of the Firestore collection
 * @param {number} itemsPerPage - Number of items to fetch per page
 * @param {string} orderByField - Field to sort by
 * @param {string} orderDirection - Sort direction ('asc' or 'desc')
 */
const usePagination = (collectionName, itemsPerPage = 10, orderByField = 'createdAt', orderDirection = 'desc') => {
  const { getPaginatedCollection, getCollectionCount } = useAppContext();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // We store the 'lastVisible' doc of the PREVIOUS page to start the current page
  // Page 1: starts after null
  // Page 2: starts after page 1's last doc
  const [cursorHistory, setCursorHistory] = useState([null]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);

  const fetchTotalCount = useCallback(async () => {
    try {
      const count = await getCollectionCount(collectionName);
      setTotalCount(count);
    } catch (err) {
      console.error('Pagination: Failed to fetch total count', err);
    }
  }, [collectionName, getCollectionCount]);

  const loadPage = useCallback(async (pageNumber, cursor) => {
    setLoading(true);
    try {
      const { data: pageData, lastDoc } = await getPaginatedCollection(collectionName, {
        limitCount: itemsPerPage,
        orderByField,
        orderDirection,
        lastVisible: cursor
      });

      setData(pageData);
      setLastVisibleDoc(lastDoc);
      setCurrentPage(pageNumber);
      
      // If we are moving to a new page (Next), add the cursor to history if it's not already there
      if (pageNumber > cursorHistory.length) {
        setCursorHistory(prev => [...prev, cursor]);
      }
    } catch (err) {
      console.error('Pagination: Failed to load page', err);
    } finally {
      setLoading(false);
    }
  }, [collectionName, itemsPerPage, orderByField, orderDirection, getPaginatedCollection, cursorHistory]);

  // Initial load
  useEffect(() => {
    fetchTotalCount();
    loadPage(1, null);
  }, [collectionName]); // Only re-run if collection changes

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const goToPage = useCallback(async (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) return;

    // If we have the cursor in history, use it
    if (pageNumber <= cursorHistory.length) {
      loadPage(pageNumber, cursorHistory[pageNumber - 1]);
    } else {
      // For unvisited forward pages, we have to "walk" or jump.
      // Firestore doesn't have offset, so we fetch up to the target.
      setLoading(true);
      try {
        const jumpLimit = (pageNumber - 1) * itemsPerPage;
        const result = await getPaginatedCollection(collectionName, {
          limitCount: jumpLimit,
          orderByField,
          orderDirection,
          lastVisible: null // Start from the beginning
        });

        const targetCursor = result.lastDoc;
        
        // Update history with the new found cursor for the target page
        setCursorHistory(prev => {
          const newHistory = [...prev];
          newHistory[pageNumber - 1] = targetCursor;
          return newHistory;
        });

        loadPage(pageNumber, targetCursor);
      } catch (err) {
        console.error('Pagination: Failed to jump to page', err);
      } finally {
        setLoading(false);
      }
    }
  }, [currentPage, totalPages, cursorHistory, itemsPerPage, collectionName, orderByField, orderDirection, getPaginatedCollection, loadPage]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages && lastVisibleDoc) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, lastVisibleDoc, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  return {
    data,
    loading: loading || !getPaginatedCollection,
    totalCount,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    refresh: () => loadPage(currentPage, cursorHistory[currentPage - 1])
  };
};

export default usePagination;
