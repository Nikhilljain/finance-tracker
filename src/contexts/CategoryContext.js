import React, { createContext, useState } from 'react';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  // Default categories
  const defaultCategories = [
    'Food', 'Grocery', 'Laundry', 'Shopping', 
    'Maids', 'Medical', 'Entertainment', 'Transportation',
    'Utilities', 'Rent', 'Education'
  ];
  
  const [categories, setCategories] = useState(defaultCategories);
  
  const addCategory = (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };
  
  return (
    <CategoryContext.Provider value={{ categories, addCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};