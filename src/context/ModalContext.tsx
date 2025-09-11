"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

type PaymentModalProp = {
    open:boolean ;
    openModal: () => void;
    closeModal: () => void;
  };
  
  const ModalContext = createContext<PaymentModalProp | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);

const openModal=()=>{
    setOpen(true)
}
const closeModal=()=>{
    setOpen(false)
}

  return (
    <ModalContext.Provider value={{ open, openModal,closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
