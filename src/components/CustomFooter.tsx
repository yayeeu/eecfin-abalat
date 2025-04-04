
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const CustomFooter = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Ethiopian Evangelical Church in Finland. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
