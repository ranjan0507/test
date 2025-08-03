import { Input } from "@/components/ui/input.tsx";
import { SearchIcon, Bell, Settings, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search your content"
            className="pl-10 w-80 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
