
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { 
  Users, 
  LayoutDashboard, 
  UserCircle,
  MessageSquare,
  UserCog
} from "lucide-react";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar className="border-r border-r-border min-w-52 max-w-52">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className={isActive("/admin") || isActive("/admin/dashboard") ? "active" : ""}>
                <SidebarMenuButton asChild>
                  <Link to="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className={isActive("/admin/profile") ? "active" : ""}>
                <SidebarMenuButton asChild>
                  <Link to="/admin/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Members</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>                
              <SidebarMenuItem className={isActive("/admin/all-members") ? "active" : ""}>
                <SidebarMenuButton asChild>
                  <Link to="/admin/all-members">
                    <Users className="mr-2 h-4 w-4" />
                    <span>All Members</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className={isActive("/admin/manage-members") ? "active" : ""}>
                <SidebarMenuButton asChild>
                  <Link to="/admin/manage-members">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Manage Members</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className={isActive("/admin/contact-logs") ? "active" : ""}>
                <SidebarMenuButton asChild>
                  <Link to="/admin/contact-logs">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Contact Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;

