
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/all-members', label: 'All Members' },
  { path: '/admin/manage-members', label: 'Manage Members' },
  { path: '/admin/manage-ministries', label: 'Ministries' },
  { path: '/admin/contact-logs', label: 'Contact Logs' },
];

const AdminHeader: React.FC = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  
  return (
    <header className="bg-eecfin-navy shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/admin" className="flex items-center">
              <img 
                src="/lovable-uploads/010ebde5-605e-4cfe-b2cc-1caacf7c5734.png" 
                alt="EECFIN Logo" 
                className="h-12 w-auto"
              />
              <span className="text-eecfin-gold text-xl font-semibold ml-3">
                Admin
              </span>
            </Link>

            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-eecfin-gold bg-eecfin-navy-light'
                      : 'text-gray-300 hover:text-eecfin-gold hover:bg-eecfin-navy-light'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="text-eecfin-gold hover:bg-eecfin-navy-light"
                >
                  <UserRound className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/admin/profile" className="flex items-center">
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
