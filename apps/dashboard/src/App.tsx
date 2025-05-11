import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Providers from '@/pages/Providers';
import PromptModules from '@/pages/PromptModules';
import Executions from '@/pages/Executions';
import Settings from '@/pages/Settings';
import ChatTest from '@/pages/ChatTest';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/providers" element={<Providers />} />
                <Route path="/prompt-modules" element={<PromptModules />} />
                <Route path="/pipelines" element={<div className="p-6">パイプライン機能は開発中です</div>} />
                <Route path="/executions" element={<Executions />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chat-test" element={<ChatTest />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
