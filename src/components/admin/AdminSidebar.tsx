
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
  Settings, 
  LayoutDashboard, 
  BookOpen, 
  Church, 
  Image, 
  Calendar
} from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";

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
              <SidebarMenuItem active={isActive("/admin")}>
                <SidebarMenuButton asChild>
                  <Link to="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <RoleGuard allowedRoles={["admin"]}>
          <SidebarGroup>
            <SidebarGroupLabel>Members</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem active={isActive("/admin/manage-members")}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/manage-members">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Manage Members</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem active={isActive("/admin/all-members")}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/all-members">
                      <Users className="mr-2 h-4 w-4" />
                      <span>All Members</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </RoleGuard>

        <RoleGuard allowedRoles={["admin", "elder"]}>
          <SidebarGroup>
            <SidebarGroupLabel>Leadership</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem active={isActive("/admin/manage-elders")}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/manage-elders">
                      <Church className="mr-2 h-4 w-4" />
                      <span>Manage Elders</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem active={isActive("/admin/my-members")}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/my-members">
                      <Users className="mr-2 h-4 w-4" />
                      <span>My Members</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </RoleGuard>

        <RoleGuard allowedRoles={["admin"]}>
          <SidebarGroup>
            <SidebarGroupLabel>Content</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem active={isActive("/admin/manage-ministries")}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/manage-ministries">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Manage Ministries</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem active={isActive("/admin/manage-slider")}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/manage-slider">
                      <Image className="mr-2 h-4 w-4" />
                      <span>Manage Slider</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem active={isActive("/admin/manage-events")}>
                  <SidebarMenuButton asChild>
                    <Link to="/admin/manage-events">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Manage Events</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </RoleGuard>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
