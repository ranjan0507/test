import { useState } from "react";
import { Edit2, Trash2, ExternalLink, Calendar, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContentPreview from "./ContentPreview";
import type { Content, Category } from "@/types";

interface ContentCardProps {
  content: Content;
  categories: Category[];
  viewMode: "grid" | "list";
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export default function ContentCard({ 
  content, 
  categories, 
  viewMode, 
  onEdit, 
  onDelete 
}: ContentCardProps) {
  const [showActions, setShowActions] = useState(false);

  const category = categories.find(cat => cat._id === content.categoryId);
  const typeColors = {
    note: "bg-green-100 text-green-800",
    link: "bg-blue-100 text-blue-800",
    video: "bg-red-100 text-red-800",
    tweet: "bg-purple-100 text-purple-800",
  };

  if (viewMode === "list") {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <ContentPreview content={content} size="small" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{content.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[content.type as keyof typeof typeColors]}`}>
                  {content.type}
                </span>
                {category && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {category.name}
                  </span>
                )}
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(content._id, { title: content.title + " (edited)" })}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(content._id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <ContentPreview content={content} size="large" />
        {showActions && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={() => onEdit(content._id, { title: content.title + " (edited)" })}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
              onClick={() => onDelete(content._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
            {content.title}
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[content.type as keyof typeof typeColors]}`}>
              {content.type}
            </span>
            {category && (
              <span className="text-xs text-gray-500">{category.name}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}