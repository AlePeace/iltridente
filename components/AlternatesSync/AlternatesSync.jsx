"use client";

import { useAlternates } from "context/AlternatesContext";
import { useEffect } from "react";

export function AlternatesSync({ alternates }) {
  const { setAlternates } = useAlternates();
  useEffect(() => {
    if (alternates) setAlternates(alternates);
  }, [alternates, setAlternates]);
  return null;
}
