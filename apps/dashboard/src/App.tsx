import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Providers from '@/pages/Providers';
import PromptModules from '@/pages/PromptModules';
import Executions from '@/pages/Executions';
import Settings from '@/pages/Settings';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/prompt-modules" element={<PromptModules />} />
          <Route path="/executions" element={<Executions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <Toaster />
    </>
  );
}

export default App;
