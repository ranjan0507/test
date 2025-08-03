import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuth } from "./contexts/AuthContext";
import AuthForm from "./components/auth/AuthForm";
import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
// import Search from "./pages/Search";
// import MyContent from "./pages/MyContent";
// import Settings from "./pages/Settings";
// import NewContentPage from "./pages/NewContentPage";

export default function App() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <AuthForm
          mode={authMode}
          onToggleMode={() =>
            setAuthMode(authMode === "login" ? "register" : "login")
          }
        />
        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/search" element={<Search />} />
            <Route path="/my" element={<MyContent />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/new" element={<NewContentPage />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}
