
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";

const CustomHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to={user ? "/admin" : "/auth"} className="font-bold text-xl">
              EECFIN
            </Link>
          </div>

          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {user && (
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link 
                to="/admin" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/profile" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </Link>
              <Button 
                variant="outline" 
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && user && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={toggleMenu}
            >
              Profile
            </Link>
            <Button 
              className="w-full mt-3 flex items-center gap-2 justify-center" 
              variant="outline" 
              onClick={signOut}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default CustomHeader;
