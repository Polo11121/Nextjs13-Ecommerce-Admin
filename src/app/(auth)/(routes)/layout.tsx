import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-center items-center h-full">{children}</div>
);

export default AuthLayout;
