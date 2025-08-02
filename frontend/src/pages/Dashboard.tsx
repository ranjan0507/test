import { MessageSquare, Video, Link, FileText, ExternalLink, Calendar, Eye, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { categoriesApi, contentApi, linksApi } from "../services/api";
import type { Category, Content, Link as LinkType } from "../types";
import toast from "react-hot-toast";

interface CategoryCardProps {
  title: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}

function CategoryCard({ title, count, icon: Icon, onClick }: CategoryCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 p-4 text-white hover:bg-gray-750 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6 text-gray-400" />
        <span className="text-sm text-gray-400">{count} saved</span>
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
    </Card>
  );
}

interface ContentItemProps {
  content: Content;
  onDelete: (id: string) => void;
}

function ContentItem({ content, onDelete }: ContentItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-gray-800/50">
      <td className="py-3 text-white">{content.title}</td>
      <td className="py-3 text-gray-300">{content.type}</td>
      <td className="py-3 text-gray-300">-</td>
      <td className="py-3">
        <div className="flex flex-wrap gap-1">
          {content.tags?.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700 text-xs rounded text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3 text-gray-300">{formatDate(content.createdAt)}</td>
      <td className="py-3">
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-white">
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(content._id)}
            className="text-red-400 hover:text-red-300"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, contentData, linksData] = await Promise.all([
        categoriesApi.getAll(),
        contentApi.getAll(),
        linksApi.getAll(),
      ]);
      
      setCategories(categoriesData);
      setContent(contentData);
      setLinks(linksData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await contentApi.delete(contentId);
      setContent(content.filter(item => item._id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const createNewCategory = async () => {
    try {
      const name = prompt('Enter category name:');
      if (name) {
        const newCategory = await categoriesApi.create(name);
        setCategories([...categories, newCategory]);
        toast.success('Category created successfully');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  // Calculate category stats
  const categoryStats = categories.map(category => ({
    title: category.name,
    count: content.filter(item => item.categoryId === category._id).length,
    icon: getIconForCategory(category.name),
  }));

  // Add default categories with real counts
  const defaultCategories = [
    {
      title: "Tweets",
      count: content.filter(item => item.type === 'tweet').length,
      icon: MessageSquare,
    },
    {
      title: "Videos", 
      count: content.filter(item => item.type === 'video').length,
      icon: Video,
    },
    {
      title: "Links",
      count: links.length,
      icon: Link,
    },
    {
      title: "Notes",
      count: content.filter(item => item.type === 'note').length,
      icon: FileText,
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gray-900 min-h-screen text-white">
      {/* Your Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Categories</h2>
          <Button 
            onClick={createNewCategory}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultCategories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
          {categoryStats.map((category, index) => (
            <CategoryCard key={`custom-${index}`} {...category} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700 p-4 text-white">
            <h3 className="font-medium mb-2">Create Content</h3>
            <p className="text-sm text-gray-400 mb-3">Add new notes, links, or other content to your brain.</p>
            <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 p-4 text-white">
            <h3 className="font-medium mb-2">Import Data</h3>
            <p className="text-sm text-gray-400 mb-3">Import content from external sources or files.</p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
              Import
            </Button>
          </Card>
        </div>
      </section>

      {/* Saved Content */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Saved Content ({content.length} items)</h2>
        <Card className="bg-gray-800 border-gray-700">
          {content.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No content yet. Start by creating your first item!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Item Name</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Size</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Tags</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Date Added</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map((item) => (
                    <ContentItem 
                      key={item._id} 
                      content={item} 
                      onDelete={handleDeleteContent}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

function getIconForCategory(name: string) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('tweet') || lowerName.includes('social')) return MessageSquare;
  if (lowerName.includes('video')) return Video;
  if (lowerName.includes('link') || lowerName.includes('url')) return Link;
  return FileText;
}
