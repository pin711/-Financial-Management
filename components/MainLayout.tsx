
import React from 'react';
import { View } from '../App';
import { LayoutDashboard, Wallet, ArrowLeftRight, PieChart, LogOut, Info } from 'lucide-react';
import { auth, isOfflineMode } from '../firebase';
import { signOut } from 'firebase/auth';

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
  user: any;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentView, setCurrentView, user }) => {
  const handleSignOut = async () => {
    if (!isOfflineMode) {
      await signOut(auth);
    }
    window.location.reload();
  };

  const menuItems = [
    { id: View.DASHBOARD, label: '儀表板', icon: LayoutDashboard },
    { id: View.ACCOUNTS, label: '銀行帳戶', icon: Wallet },
    { id: View.TRANSACTIONS, label: '收支紀錄', icon: ArrowLeftRight },
    { id: View.REPORTS, label: '統計報告', icon: PieChart },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">我的金流管家</h1>
          {isOfflineMode && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">離線演示模式</span>}
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
              {user?.email?.charAt(0) || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-xs text-gray-400">目前登入</p>
              <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-blue-600">金流管家</h1>
          <button onClick={handleSignOut} className="p-2 text-red-600"><LogOut className="w-5 h-5" /></button>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-white border-t flex justify-around p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                currentView === item.id ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default MainLayout;
