import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  User,
  Plus,
  Heart,
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/my", icon: User, label: "My" },
  { to: "/create", icon: Plus, label: "New Item" },
  { to: "/favorites", icon: Heart, label: "Favorites" },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Brain</h1>
        {user && <p className="text-sm text-gray-400 mt-1">Welcome, {user.username}</p>}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-2 border-t border-gray-700">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
              isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>

        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
}
