import { useCallback } from 'react';
import { db } from '../config/firebase.js';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  orderBy, 
  limit, 
  startAfter, 
  getCountFromServer 
} from 'firebase/firestore';

const useFirestore = () => {

  const getCollection = useCallback(async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
    } catch (err) {
      console.error(`Error getting collection ${collectionName}:`, err);
      throw err;
    }
  }, []);

  const getPaginatedCollection = useCallback(async (collectionName, options = {}) => {
    const { 
      limitCount = 10, 
      orderByField = 'createdAt', 
      orderDirection = 'desc', 
      lastVisible = null 
    } = options;

    try {
      let q = query(
        collection(db, collectionName), 
        orderBy(orderByField, orderDirection), 
        limit(limitCount)
      );

      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { data, lastDoc };
    } catch (err) {
      console.error(`Error getting paginated collection ${collectionName}:`, err);
      throw err;
    }
  }, []);

  const getCollectionCount = useCallback(async (collectionName) => {
    try {
      const coll = collection(db, collectionName);
      const snapshot = await getCountFromServer(coll);
      return snapshot.data().count;
    } catch (err) {
      console.error(`Error getting count for ${collectionName}:`, err);
      throw err;
    }
  }, []);

  const getDocument = useCallback(async (collectionName, documentId) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (err) {
      console.error(`Error getting document from ${collectionName}:`, err);
      throw err;
    }
  }, []);

  const findDocumentByField = useCallback(async (collectionName, fieldName, fieldValue) => {
    try {
      const q = query(collection(db, collectionName), where(fieldName, "==", fieldValue));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const document = querySnapshot.docs[0];
        return { id: document.id, ...document.data() };
      }
      return null;
    } catch (err) {
      console.error(`Error finding document in ${collectionName}:`, err);
      throw err;
    }
  }, []);

  const addDocument = useCallback(async (collectionName, documentData) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), documentData);
      return docRef.id;
    } catch (err) {
      console.error(`Error adding document to ${collectionName}:`, err);
      throw err;
    }
  }, []);

  const updateDocument = useCallback(async (collectionName, documentId, updatedData) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, updatedData);
    } catch (err) {
      console.error(`Error updating document in ${collectionName}:`, err);
      throw err;
    }
  }, []);

  const deleteDocument = useCallback(async (collectionName, documentId) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(`Error deleting document from ${collectionName}:`, err);
      throw err;
    }
  }, []);

  return { 
    getCollection, 
    getPaginatedCollection,
    getCollectionCount,
    getDocument, 
    findDocumentByField,
    addDocument, 
    updateDocument, 
    deleteDocument 
  };
};

export default useFirestore;
