import React, { createContext, useContext, useState, useEffect } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalCount, setModalCount] = useState(0);

  useEffect(() => {
    const root = document.getElementById('root');
    if (modalCount > 0) {
      root.setAttribute('inert', 'true');
    } else {
      root.removeAttribute('inert');
    }
  }, [modalCount]);

  const openModal = () => setModalCount(prev => prev + 1);
  const closeModal = () => setModalCount(prev => prev - 1);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
