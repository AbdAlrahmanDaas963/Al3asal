import React, { createContext, useState, useContext } from "react";

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    type: null,
    props: {},
  });

  const openDialog = (type, props = {}) => {
    setDialogState({ open: true, type, props });
  };

  const closeDialog = () => {
    setDialogState({ open: false, type: null, props: {} });
  };

  return (
    <DialogContext.Provider value={{ dialogState, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);
