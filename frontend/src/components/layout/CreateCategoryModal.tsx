import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface CreateCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function CreateCategoryModal({ open, onClose, onSubmit }: CreateCategoryModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Category name is required");
    onSubmit(name.trim());
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-700 rounded-xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle id="category-dialog-title" className="text-lg font-semibold">Create Category</DialogTitle>
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
        {/* Radix UI accessibility: DialogTitle */}
        <span style={{display:'none'}} id="DialogTitle">Create Category</span>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Category Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
          <Button onClick={handleSubmit} className="bg-violet-600 hover:bg-violet-700 text-white">
            Save Category
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
