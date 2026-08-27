"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface SofiaPanelContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SofiaPanelContext = createContext<SofiaPanelContextType | null>(null);

export function SofiaPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <SofiaPanelContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SofiaPanelContext.Provider>
  );
}

export function useSofiaPanel() {
  const ctx = useContext(SofiaPanelContext);
  if (!ctx) {
    throw new Error("useSofiaPanel debe usarse dentro de <SofiaPanelProvider>");
  }
  return ctx;
}
