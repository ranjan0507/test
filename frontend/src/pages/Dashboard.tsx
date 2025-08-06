import { useState } from "react";
import { Plus, Search, Grid3X3, List, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/hooks/useContent";
import { useCategories } from "@/hooks/useCategories";
import { useCreateContent, useEditContent, useDeleteContent } from "@/hooks/useCreateContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ContentCard from "@/components/content/ContentCard";
import CreateContentModal from "@/components/modals/CreateContentModal";
import StatsCards from "@/components/dashboard/StatsCards";
import EmptyState from "@/components/dashboard/EmptyState";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { user } = useAuth();
  const { data: contents = [], isLoading: contentsLoading } = useContent();
  const { data: categories = [] } = useCategories();
  const createContent = useCreateContent();
  const editContent = useEditContent();
  const deleteContent = useDeleteContent();

  // Filter contents based on search, type, and category
  const filteredContents = contents.filter((content) => {
    const matchesSearch = search === "" || 
      content.title.toLowerCase().includes(search.toLowerCase()) ||
      (content.content && content.content.toLowerCase().includes(search.toLowerCase()));
    
    const matchesType = filterType === "all" || content.type === filterType;
    
    const matchesCategory = filterCategory === "all" || content.categoryId === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

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

  const handleEditContent = (id: string, data: any) => {
    editContent.mutate({ _id: id, data }, {
      onSuccess: () => toast.success("Content updated!"),
      onError: () => toast.error("Failed to update content"),
    });
  };

  const handleDeleteContent = (id: string) => {
    if (confirm("Are you sure you want to delete this content?")) {
      deleteContent.mutate(id, {
        onSuccess: () => toast.success("Content deleted!"),
        onError: () => toast.error("Failed to delete content"),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}!</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Stats Cards */}
      <StatsCards contents={contents} />

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search your content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="note">Notes</option>
              <option value="link">Links</option>
              <option value="video">Videos</option>
              <option value="tweet">Tweets</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-400"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-400"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid/List */}
      {contentsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredContents.length === 0 ? (
        <EmptyState 
          hasContent={contents.length > 0}
          onCreateContent={() => setShowCreateModal(true)}
        />
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredContents.map((content) => (
            <ContentCard
              key={content._id}
              content={content}
              categories={categories}
              viewMode={viewMode}
              onEdit={handleEditContent}
              onDelete={handleDeleteContent}
            />
          ))}
        </div>
      )}

      {/* Create Content Modal */}
      <CreateContentModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateContent}
        categories={categories}
      />
    </div>
  );
}