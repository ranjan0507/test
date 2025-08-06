import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/types";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content?: string;
    description?: string;
    type: string;
    categoryId?: string;
    tags?: string[];
  }) => void;
  categories: Category[];
}

export default function CreateContentModal({
  open,
  onClose,
  onSubmit,
  categories
}: CreateContentModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("note");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      type,
      categoryId: categoryId || undefined,
    });

    // Reset form
    setTitle("");
    setContent("");
    setType("note");
    setCategoryId("");
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setType("note");
    setCategoryId("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Content</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="note">📝 Note</option>
              <option value="link">🔗 Link</option>
              <option value="video">🎥 Video</option>
              <option value="tweet">🐦 Tweet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === "note" ? "Content" : "URL or Description"}
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === "note" 
                  ? "Write your note here..." 
                  : type === "link"
                  ? "https://example.com"
                  : type === "video"
                  ? "https://youtube.com/watch?v=..."
                  : "https://twitter.com/user/status/..."
              }
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category (Optional)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Content
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}