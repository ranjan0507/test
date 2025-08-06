import { useState } from "react";
import { Plus, Edit2, Trash2, Folder } from "lucide-react";
import toast from "react-hot-toast";
import { useCategories } from "@/hooks/useCategories";
import { useCreateCategory } from "@/hooks/useCreateCategory";
import { useContent } from "@/hooks/useContent";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CreateCategoryModal from "@/components/modals/CreateCategoryModal";
import EmptyState from "@/components/dashboard/EmptyState";

export default function Categories() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: categories = [], isLoading } = useCategories();
  const { data: contents = [] } = useContent();
  const createCategory = useCreateCategory();

  const handleCreateCategory = (name: string) => {
    createCategory.mutate(name, {
      onSuccess: () => {
        toast.success("Category created successfully!");
        setShowCreateModal(false);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create category");
      },
    });
  };

  const getCategoryItemCount = (categoryId: string) => {
    return contents.filter(content => content.categoryId === categoryId).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Organize your content with categories</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-600 mb-6">Create your first category to organize your content</p>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category._id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {getCategoryItemCount(category._id)} items
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Created {new Date(category.createdAt).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}