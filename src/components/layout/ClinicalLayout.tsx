import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Settings, LogOut, User } from 'lucide-react';

export const ClinicalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redirect to Landing Page instead of Clinical Login
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">SympSense AI</span>
          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">CLINICAL</span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-1">
            <Link to="/clinical/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.includes('dashboard') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Ward Overview
              </div>
            </Link>
            <Link to="/clinical/settings" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.includes('settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </div>
            </Link>
          </nav>
          
          <div className="h-6 w-px bg-gray-200"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Dr. Sarah Connor</p>
              <p className="text-xs text-gray-500">Senior Intensivist</p>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
