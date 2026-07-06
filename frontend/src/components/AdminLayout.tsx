import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { 
  FiGrid, FiBriefcase, FiCpu, FiAward, FiBookOpen, 
  FiUser, FiImage, FiMail, FiSettings, FiLogOut, FiMenu, FiX, FiFolder 
} from 'react-icons/fi';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: FiGrid },
    { name: 'Projects', path: '/admin/projects', icon: FiFolder },
    { name: 'Experience', path: '/admin/experience', icon: FiBriefcase },
    { name: 'Skills', path: '/admin/skills', icon: FiCpu },
    { name: 'Certificates', path: '/admin/certificates', icon: FiAward },
    { name: 'Education', path: '/admin/education', icon: FiBookOpen },
    { name: 'Profile', path: '/admin/profile', icon: FiUser },
    { name: 'Gallery', path: '/admin/gallery', icon: FiImage },
    { name: 'Messages', path: '/admin/messages', icon: FiMail },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-[#030010] text-gray-200 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#070518]/90 border-r border-white/5 backdrop-blur-md">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link to="/" className="text-md font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-widest">
            Portfolio Admin
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20 shadow-lg' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer border border-transparent hover:border-red-500/20"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="w-64 bg-[#070518] border-r border-white/10 flex flex-col h-full animate-slide-in">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <span className="text-md font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">
                Admin Panel
              </span>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-600/25 text-purple-300 border border-purple-500/30' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/5">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Mobile Header Bar */}
        <header className="flex items-center justify-between h-16 px-6 bg-[#070518]/60 border-b border-white/5 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <span className="text-sm font-extrabold tracking-widest bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase">
            ADMIN PORTAL
          </span>
          <div className="w-6"></div> {/* Spacer to center the logo */}
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div className="flex-1">
            <Outlet />
          </div>
          <footer className="mt-16 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-xs font-medium tracking-tight">
              Copy-right &copy; Arun. Made with <span className="inline-block animate-pulse text-red-500">💖</span> by <span className="font-bold underline text-white">Arun Software Solutions</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
