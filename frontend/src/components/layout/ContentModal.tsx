import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { X } from "lucide-react";
import type { Category } from "../../types/index.ts";
import toast from "react-hot-toast";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    url?: string;
    description?: string;
    type?: string;
    content?: string;
    catId?: string;
    catName?: string;
  }) => void;
  categories: Category[];
}

export default function CreateContentModal({
  open,
  onClose,
  onSubmit,
  categories                    // destructure it here
}: CreateContentModalProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("note");
  const [selectedCatId, setSelectedCatId] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const handleSubmit = () => {
    if (!title) return toast.error("Title is required");
    if (type !== "note" && !url) return toast.error("URL is required for this type");

    // For notes, send content instead of url
    const payload: { title: string; url?: string; content?: string; type: string; description?: string; catId?: string; catName?: string } = {
      title: title.trim(),
      type,
    };
    if (description && description.trim()) {
      payload.description = description.trim();
    }
    if (type === "note") {
      payload.content = description.trim() || title.trim();
    } else if (url && url.trim()) {
      payload.url = url.trim();
    }

    if (newCatName.trim()) {
      payload.catName = newCatName.trim();
    } else if (selectedCatId) {
      payload.catId = selectedCatId;
    }

    onSubmit(payload);
    setTitle("");
    setUrl("");
    setDescription("");
    setType("note");
    setSelectedCatId("");
    setNewCatName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-700 rounded-xl" aria-labelledby="content-dialog-title" aria-describedby="content-dialog-desc">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle id="content-dialog-title">Create Content</DialogTitle>
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
        <p id="content-dialog-desc" className="text-gray-400 text-sm mb-2">Fill in the details to save a link, video, tweet, or note. Only title is required for notes.</p>

        <div className="flex flex-col gap-4">
          <label className="text-sm text-gray-400">Type</label>
          <select
            className="bg-zinc-800 text-white border-zinc-700 p-2 rounded"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="note">Note</option>
            <option value="tweet">Tweet</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
          </select>

          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />

          {type !== "note" && (
            <Input
              placeholder="URL (YouTube, tweet, etc.)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          )}

          <Textarea
            placeholder={type === "note" ? "Note text (optional)" : "Optional description"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white resize-none"
          />

          <select
            className="bg-zinc-800 text-white border-zinc-700 p-2 rounded"
            value={selectedCatId}
            onChange={(e) => {
              setSelectedCatId(e.target.value);
              setNewCatName("");
            }}
          >
            <option value="">Select Category (optional)</option>
            {(Array.isArray(categories) ? categories : []).map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Or create new category"
            value={newCatName}
            onChange={(e) => {
              setNewCatName(e.target.value);
              setSelectedCatId("");
            }}
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
