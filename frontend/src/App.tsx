import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AuthForm from "./components/auth/AuthForm";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes } from "react-router-dom";

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
      />
    );
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path=""/>
      </Routes>
      <AppContent />
      <Toaster position="bottom-right" />
    </BrowserRouter>
    </AuthProvider>
  );
}
