import { NavLink } from "react-router-dom";
import { LayoutDashboard, Folder, Plus, Brain } from "lucide-react";
import { useState } from "react";
import CreateContentModal from "@/components/modals/CreateContentModal";
import { useCategories } from "@/hooks/useCategories";
import { useCreateContent } from "@/hooks/useCreateContent";
import toast from "react-hot-toast";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/categories", icon: Folder, label: "Categories" },
];

export default function Sidebar() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: categories = [] } = useCategories();
  const createContent = useCreateContent();

  const handleCreateContent = (data: any) => {
    const payload = {
      title: data.title,
      content: data.content || data.description,
      type: data.type,
      categoryId: data.categoryId,
      tags: data.tags || []
    };

    createContent.mutate(payload, {
      onSuccess: () => {
        toast.success("Content created successfully!");
        setShowCreateModal(false);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create content");
      },
    });
  };

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Brain</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 mt-4"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Content</span>
          </button>
        </nav>

        {/* Quick Categories */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            {categories.slice(0, 5).map((category) => (
              <div
                key={category._id}
                className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="truncate">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CreateContentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateContent}
        categories={categories}
      />
    </>
  );
}