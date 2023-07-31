"use client";

import { ReactNode, useEffect, useState } from "react";

export const MountingProvider = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return isMounted ? children : null;
};
