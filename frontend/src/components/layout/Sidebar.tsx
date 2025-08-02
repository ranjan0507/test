import { LayoutDashboard, Search, User, Plus, Heart, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon: Icon, label, isActive = false, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-colors",
        isActive
          ? "bg-white/10 text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Brain</h1>
        {user && (
          <p className="text-sm text-gray-400 mt-1">Welcome, {user.username}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" isActive />
        <SidebarItem icon={Search} label="Search" />
        <SidebarItem icon={User} label="My" />
        <SidebarItem icon={Plus} label="New Item" />
        <SidebarItem icon={Heart} label="Favorites" />
      </nav>

      {/* Bottom actions */}
      <div className="p-4 space-y-2 border-t border-gray-700">
        <SidebarItem icon={Settings} label="Settings" />
        <SidebarItem icon={LogOut} label="Log out" onClick={logout} />
      </div>
    </div>
  );
}
