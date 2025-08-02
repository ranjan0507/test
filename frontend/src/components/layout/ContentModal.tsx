import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { categoriesApi } from "@/services/api";
import type { Category } from "@/types";
import toast from "react-hot-toast";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    url: string;
    description: string;
    catId?: string;
    catName?: string;
  }) => void;
}

export default function CreateContentModal({ open, onClose, onSubmit }: CreateContentModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  const handleSubmit = () => {
    if (!title || !url) return toast.error("Title and URL are required");

    const payload: {
      title: string;
      url: string;
      description: string;
      catId?: string;
      catName?: string;
    } = { title, url, description };

    if (newCatName) {
      payload.catName = newCatName;
    } else if (selectedCatId) {
      payload.catId = selectedCatId;
    }

    onSubmit(payload);
    setTitle("");
    setUrl("");
    setDescription("");
    setSelectedCatId("");
    setNewCatName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-700 rounded-xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Content</h2>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute right-4 top-4 rounded-full"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />

          <Input
            placeholder="URL (YouTube, tweet, etc.)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />

          <Textarea
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white resize-none"
          />

          <select
            className="bg-zinc-800 text-white border-zinc-700 p-2 rounded"
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
          >
            <option value="">Select Category (optional)</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Or create new category"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />

          <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700 text-white">
            Save Content
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
