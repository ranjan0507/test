import { Plus, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasContent: boolean;
  onCreateContent: () => void;
}

export default function EmptyState({ hasContent, onCreateContent }: EmptyStateProps) {
  if (hasContent) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Brain className="w-10 h-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Brain App!</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Start building your personal knowledge base by saving links, videos, tweets, and notes all in one place.
      </p>
      <Button 
        onClick={onCreateContent}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Your First Content
      </Button>
    </div>
  );
}