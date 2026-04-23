"use client";

import { createContext, useContext, useState } from "react";

const AlternatesContext = createContext({ alternates: {}, setAlternates: () => {} });

export function AlternatesProvider({ children }) {
  const [alternates, setAlternates] = useState({});
  return (
    <AlternatesContext.Provider value={{ alternates, setAlternates }}>
      {children}
    </AlternatesContext.Provider>
  );
}

export function useAlternates() {
  return useContext(AlternatesContext);
}
