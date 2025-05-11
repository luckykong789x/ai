import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Server, 
  FileText, 
  Play, 
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';
import { t, setLanguage } from '@/lib/i18n';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLanguage('ja');
  }, []);

  const navItems = [
    { path: '/', label: t('dashboard'), icon: <LayoutGrid className="w-5 h-5" /> },
    { path: '/providers', label: t('providers'), icon: <Server className="w-5 h-5" /> },
    { path: '/prompt-modules', label: t('promptModules'), icon: <FileText className="w-5 h-5" /> },
    { path: '/executions', label: t('executions'), icon: <Play className="w-5 h-5" /> },
    { path: '/settings', label: t('settings'), icon: <SettingsIcon className="w-5 h-5" /> },
    { path: '/chat-test', label: t('chatTitle'), icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-base text-white">
      {/* Sidebar - desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-base border-r border-gray-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-accent">AI Prompt Orchestration</span>
            </Link>
            <button 
              className="lg:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-2xl transition-colors ${
                  location.pathname === item.path
                    ? 'bg-accent text-accent-foreground'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="glass p-4 rounded-2xl">
              <p className="text-sm text-gray-300">
                {t('version')} 4.6
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {t('integrated')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <div className="flex items-center">
            <button 
              className="lg:hidden mr-4"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="hidden lg:block p-2 rounded-full hover:bg-gray-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-base">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
