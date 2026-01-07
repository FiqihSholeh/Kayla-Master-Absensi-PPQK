import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const stringifiedValue = JSON.stringify(storedValue);

      if (stringifiedValue.length > 5000000) {
        console.error('Error: Data exceeds localStorage quota limit');
        return;
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, stringifiedValue);
      } else {
        console.error('localStorage is not available');
      }
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [storedValue, key]);

  const setValue = (value) => {
    setStoredValue(value);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
