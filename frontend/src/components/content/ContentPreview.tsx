import { FileText, Link as LinkIcon, Video, MessageSquare, Image as ImageIcon } from "lucide-react";
import type { Content } from "@/types";

interface ContentPreviewProps {
  content: Content;
  size: "small" | "large";
}

export default function ContentPreview({ content, size }: ContentPreviewProps) {
  const iconSize = size === "small" ? "w-5 h-5" : "w-8 h-8";
  
  const getTypeIcon = () => {
    switch (content.type) {
      case "note":
        return <FileText className={`${iconSize} text-green-600`} />;
      case "link":
        return <LinkIcon className={`${iconSize} text-blue-600`} />;
      case "video":
        return <Video className={`${iconSize} text-red-600`} />;
      case "tweet":
        return <MessageSquare className={`${iconSize} text-purple-600`} />;
      default:
        return <FileText className={`${iconSize} text-gray-600`} />;
    }
  };

  if (size === "small") {
    return getTypeIcon();
  }

  // For large preview, show more detailed preview based on type
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      {content.type === "video" && content.content?.includes("youtube") ? (
        <div className="text-center">
          <Video className="w-12 h-12 text-red-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600">YouTube Video</p>
        </div>
      ) : content.type === "tweet" ? (
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600">Tweet</p>
        </div>
      ) : content.type === "link" ? (
        <div className="text-center">
          <LinkIcon className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600">External Link</p>
        </div>
      ) : (
        <div className="text-center p-4">
          <FileText className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600 line-clamp-3">{content.content || "Note"}</p>
        </div>
      )}
    </div>
  );
}