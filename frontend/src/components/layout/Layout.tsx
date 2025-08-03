import React from "react";
import Sidebar from "./Sidebar.tsx";
import Topbar from "./Topbar.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 overflow-y-auto bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
