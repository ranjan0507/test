import { Plus, MessageSquare, Video, Link as LinkIcon, FileText } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/hooks/useContent";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useCreateContent, useEditContent, useDeleteContent } from "../hooks/useCreateContent";

import { Button } from "../components/ui/button.tsx";
import { useCategories } from "../hooks/useCategories.ts";
import { Card }   from "../components/ui/card.tsx";
import CreateContentModal from "../components/layout/ContentModal.tsx";
import CreateCategoryModal from "../components/layout/CreateCategoryModal.tsx";
import Sidebar from "../components/layout/Sidebar.tsx";

export default function Dashboard() {
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);
  const { user } = useAuth();
  const { data: cats = [] } = useCategories();
  const { data: contents = [] } = useContent();
  const createCat = useCreateCategory();
  const createContent = useCreateContent();
  const editContent = useEditContent();
  const deleteContent = useDeleteContent();

  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const safeContents = Array.isArray(contents) ? contents : [];
  const safeCats = Array.isArray(cats) ? cats : [];
  const defaultStats = [
    { title: "Tweets", count: safeContents.filter(c => c.type === "tweet").length, icon: MessageSquare, type: "tweet" },
    { title: "Videos", count: safeContents.filter(c => c.type === "video").length, icon: Video, type: "video" },
    { title: "Links",  count: safeContents.filter(c => c.type === "link").length, icon: LinkIcon, type: "link" },
    { title: "Notes",  count: safeContents.filter(c => c.type === "note").length, icon: FileText, type: "note" },
  ];

  // Filter contents by search, type, or category
  const filteredContents = safeContents.filter((c) => {
    const matchesSearch =
      search.trim() === "" ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.content && c.content.toLowerCase().includes(search.toLowerCase())) ||
      (safeCats.find(cat => cat._id === c.categoryId)?.name?.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType ? c.type === filterType : true;
    const matchesCategory = filterCategoryId ? c.categoryId === filterCategoryId : true;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleNewCategory = () => setCategoryModalOpen(true);

  const handleCreateCategory = (name: string) => {
    createCat.mutate(name, {
      onSuccess: () => toast.success("Category added"),
      onError: () => toast.error("Failed to add category"),
    });
  };

  const handleCreateContent = (data: any) => {
    createContent.mutate(data, {
      onSuccess: () => toast.success("Content created"),
      onError: () => toast.error("Creation failed"),
    });
  };

  if (showCategoryManager) {
    return (
      <div className="flex min-h-screen">
        <Sidebar
          onCategoryClick={() => setShowCategoryManager(false)}
          onNewItemClick={() => { setModalOpen(true); setShowCategoryManager(false); }}
        />
        <main className="flex-1 p-8 bg-gray-900 text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Categories</h2>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setCategoryModalOpen(true)}>+ New Category</Button>
            <Button className="bg-gray-700 ml-2" onClick={() => setShowCategoryManager(false)}>Back to Dashboard</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeCats.length === 0 ? (
              <div className="text-gray-400 col-span-full">You have no categories yet. Click '+ New Category' to create one.</div>
            ) : (
              safeCats.map(cat => (
                <Card key={cat._id} className="p-6 bg-gray-800 border-gray-700 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{cat.name}</span>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => {/* TODO: Implement rename logic */}}>Rename</Button>
                      <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700" onClick={() => {/* TODO: Implement delete logic */}}>Delete</Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
          <CreateCategoryModal
            open={categoryModalOpen}
            onClose={() => setCategoryModalOpen(false)}
            onSubmit={handleCreateCategory}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onCategoryClick={() => setShowCategoryManager(true)}
        onNewItemClick={() => setModalOpen(true)}
      />
      <main className="flex-1 p-8 bg-gray-900 text-white space-y-8">
      <CreateContentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateContent}
        categories={cats}
      />
      <CreateCategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />

      <div className="flex items-center gap-4 mb-2">
        <input
          type="text"
          placeholder="Search by title, description, or category..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-96 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        {(filterType || filterCategoryId) && (
          <Button size="sm" className="ml-2 bg-gray-700 hover:bg-gray-600" onClick={() => { setFilterType(null); setFilterCategoryId(null); }}>
            Back to Dashboard
          </Button>
        )}
      </div>
      {search.trim() === "" ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-200">Your Categories</h2>
            <Button size="sm" onClick={handleNewCategory} className="bg-gray-600 hover:bg-gray-500">
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {defaultStats.map((s, i) => (
              <Card
                key={i}
                className="flex flex-col items-center p-6 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition"
                onClick={() => { setFilterType(s.type); setFilterCategoryId(null); }}
              >
                <s.icon className="w-6 h-6 text-gray-400" />
                <span className="mt-2 text-lg text-gray-300">{s.title}</span>
                <span className="text-sm text-gray-500">{s.count} saved</span>
              </Card>
            ))}
            {safeCats.map((c) => (
              <Card
                key={c._id}
                className="flex flex-col items-center p-6 bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition"
                onClick={() => { setFilterType(null); setFilterCategoryId(c._id); }}
              >
                <span className="text-lg text-gray-300">{c.name}</span>
                <span className="text-sm text-gray-500">
                  {safeContents.filter(x => x.categoryId === c._id).length} saved
                </span>
              </Card>
            ))}
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-200">Quick Actions</h2>
              <Button size="sm" onClick={() => setModalOpen(true)} className="bg-gray-600 hover:bg-gray-500">
                <Plus className="w-4 h-4 mr-1" /> Create Content
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredContents.map((c) => (
                <Card key={c._id} className="p-4 bg-gray-800 border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-300">{c.title}</h3>
                      <p className="text-sm text-gray-500">{c.content || 'No content'}</p>
                      <p className="text-sm text-gray-400">Type: {c.type}</p>
                      <p className="text-sm text-gray-400">Category: {safeCats.find(cat => cat._id === c.categoryId)?.name || c.categoryId}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => editContent.mutate({ _id: c._id, data: { title: c.title + ' (edited)' } })} className="bg-purple-600 hover:bg-purple-500 text-white">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteContent.mutate(c._id)} className="bg-red-600 hover:bg-red-500 text-white">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="font-medium text-gray-300 mb-2">Create Content</h3>
                <p className="text-gray-500 mb-3">Add anything you like.</p>
                <Button size="sm" onClick={() => setModalOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white">
                  <Plus className="w-4 h-4 mr-1" /> Create
                </Button>
              </Card>
              <Card className="p-4 bg-gray-800 border-gray-700">
                <h3 className="font-medium text-gray-300 mb-2">Import Data</h3>
                <p className="text-gray-500 mb-3">Import from files or links.</p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white">Import</Button>
              </Card>
            </div>
          </div>

          <section className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-gray-200">Saved Content ({contents.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContents.map((c) => (
                <Card key={c._id} className="p-4">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-zinc-500 text-sm">{new Date(c.createdAt).toLocaleDateString()}</p>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-gray-200">Search Results</h2>
          {filteredContents.length === 0 ? (
            <div className="text-gray-400 text-center py-16">No content found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContents.map((c) => (
                <Card key={c._id} className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="font-semibold text-gray-200 mb-2">{c.title}</h3>
                  <p className="text-gray-400 mb-1">{c.content || 'No content'}</p>
                  <p className="text-sm text-gray-500">Type: {c.type}</p>
                  <p className="text-sm text-gray-500">Category: {safeCats.find(cat => cat._id === c.categoryId)?.name || c.categoryId}</p>
                  <p className="text-xs text-gray-600 mt-2">{new Date(c.createdAt).toLocaleDateString()}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
