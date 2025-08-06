import { FileText, Link as LinkIcon, Video, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Content } from "@/types";

interface StatsCardsProps {
  contents: Content[];
}

export default function StatsCards({ contents }: StatsCardsProps) {
  const stats = [
    {
      title: "Notes",
      count: contents.filter(c => c.type === "note").length,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Links",
      count: contents.filter(c => c.type === "link").length,
      icon: LinkIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Videos",
      count: contents.filter(c => c.type === "video").length,
      icon: Video,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Tweets",
      count: contents.filter(c => c.type === "tweet").length,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}