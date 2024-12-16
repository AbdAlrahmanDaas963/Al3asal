import React, { createContext, useState, useContext } from "react";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({ open: false, type: null, props: {} });

  const openDialog = (type, props = {}) => {
    setDialog({ open: true, type, props });
  };

  const closeDialog = () => {
    setDialog({ open: false, type: null, props: {} });
  };

  return (
    <DialogContext.Provider value={{ dialog, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
