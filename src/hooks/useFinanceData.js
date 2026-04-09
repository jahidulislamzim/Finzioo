import { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

const useFinanceData = () => {
    const [data, setData] = useState({
        accounts: [],
        transactions: [],
        budgets: [],
        categories: [],
        loans: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const collections = ['accounts', 'transactions', 'budgets', 'categories', 'loans'];
            const fetchedData = {};
            for (const coll of collections) {
                const querySnapshot = await getDocs(collection(db, coll));
                fetchedData[coll] = querySnapshot.docs.map(document => ({ id: document.id, ...document.data() }));
            }
            setData(fetchedData);
        } catch (err) {
            setError(err);
            console.error("Error fetching data from Firestore:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addDocument = async (collectionName, documentData, customId = null) => {
        try {
            if (customId) {
                await setDoc(doc(db, collectionName, customId), documentData);
            } else {
                await addDoc(collection(db, collectionName), documentData);
            }
            await fetchData(); // Refresh data from Firebase
        } catch (err) {
            console.error(`Error adding document to ${collectionName}:`, err);
            throw err;
        }
    };

    const updateDocument = async (collectionName, documentId, updatedData) => {
        try {
            await updateDoc(doc(db, collectionName, documentId), updatedData);
            await fetchData(); // Refresh data from Firebase
        } catch (err) {
            console.error(`Error updating document in ${collectionName}:`, err);
            throw err;
        }
    };

    const deleteDocument = async (collectionName, documentId) => {
        try {
            await deleteDoc(doc(db, collectionName, documentId));
            await fetchData(); // Refresh data from Firebase
        } catch (err) {
            console.error(`Error deleting document from ${collectionName}:`, err);
            throw err;
        }
    };

    return { 
        data, 
        loading, 
        error, 
        refetchData: fetchData, 
        addDocument, 
        updateDocument, 
        deleteDocument 
    };
};

export default useFinanceData;