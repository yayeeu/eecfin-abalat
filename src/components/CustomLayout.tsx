
import React from "react";
import CustomHeader from "./CustomHeader";
import CustomFooter from "./CustomFooter";

interface LayoutProps {
  children: React.ReactNode;
}

const CustomLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomHeader />
      <main className="flex-grow">{children}</main>
      <CustomFooter />
    </div>
  );
};

export default CustomLayout;
