import { BrowserRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getQueryClient } from '../../lib/queryClient';
import { AdminProvider } from '../../contexts/AdminContext';
import DataPrefetcher from '../DataPrefetcher';
import BoardsList from './BoardsList';
import VocabularyBoardDetail from './VocabularyBoardDetail';
import VocabularyBoardsGrid from './VocabularyBoardsGrid';
import GrammarBoardsGrid from './GrammarBoardsGrid';
import ExpressionsBoardsGrid from './ExpressionsBoardsGrid';
import GrammarBoardDetail from './GrammarBoardDetail';
import ExpressionsBoardDetail from './ExpressionsBoardDetail';
import LogoutConfirmDialog from './LogoutConfirmDialog';
import { Home, BookOpen, FileText, MessageSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface DashboardSPAProps {
  isAdmin?: boolean;
}

interface UserData {
  isLoggedIn: boolean;
  isAdmin: boolean;
  username: string | null;
}

async function fetchUserData(): Promise<UserData> {
  const response = await fetch('/api/auth/me');
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

function Sidebar({ isOpen, onClose, isAdmin, username, isLoggedIn, onLogout }: { 
  isOpen: boolean; 
  onClose: () => void;
  isAdmin?: boolean;
  username?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which boards to show
  let boardType: 'grammar' | 'vocabulary' | 'idioms' | null = null;
  if (currentPath.includes('grammar')) boardType = 'grammar';
  else if (currentPath.includes('vocabulary')) boardType = 'vocabulary';
  else if (currentPath.includes('expressions')) boardType = 'idioms';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        w-[250px] bg-white border-r border-gray-200 fixed h-screen overflow-y-auto z-50 transition-transform duration-300 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="px-6 h-14 border-b font-black border-gray-200 relative flex items-center">
          <h1 className="text-xl font-black">
            My <span style={{ color: '#FF6B6B' }}>IELTS</span>
          </h1>
          
          {/* Close button for mobile */}
          <button 
            onClick={onClose} 
            className="lg:hidden absolute right-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex-1">
          {/* Main Navigation */}
          <div className="mb-6 space-y-1">
            <Link 
              to="/dashboard" 
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded hover:bg-gray-50 ${
                currentPath === '/dashboard' ? 'bg-gray-100' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </Link>
          </div>

          {/* Tabs */}
          <div className="space-y-1 mb-6">
            <Link 
              to="/dashboard/grammar" 
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded ${
                currentPath.startsWith('/dashboard/grammar') 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Grammar
            </Link>
            <Link 
              to="/dashboard/vocabulary" 
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded ${
                currentPath.startsWith('/dashboard/vocabulary') 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              Vocabulary
            </Link>
            <Link 
              to="/dashboard/expressions" 
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded ${
                currentPath.startsWith('/dashboard/expressions') 
                  ? 'bg-gray-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Idioms
            </Link>
          </div>

          {/* Boards Section */}
          {boardType && (
            <div className="border-t border-gray-200 pt-4">
              <div className="px-3 py-2 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">Boards</span>
              </div>

              <BoardsList type={boardType} />
            </div>
          )}
        </nav>

        {/* Credit */}
        <div className="border-t border-gray-200 px-4 py-3">
          <a 
            href="https://quocbui.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center text-xs font-black hover:opacity-80 transition-opacity"
            style={{ color: '#4B4B4B' }}
          >
            <span style={{ color: '#FF6B6B' }}>Made</span>
            <span className="mx-1">by quocbui.dev with</span>
            <span style={{ color: '#FF6B6B' }}>❤</span>
          </a>
        </div>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{username || 'User'}</p>
                <p className="text-xs text-gray-500">{isAdmin ? 'Admin' : 'User'}</p>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Đăng xuất"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <a 
              href="/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-white font-bold transition-all duration-150 active:translate-y-[4px]"
              style={{ backgroundColor: '#FF6B6B', boxShadow: '0 4px 0 0 #CC3333' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#FA5252';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FF6B6B';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0 #CC3333';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 0 0 #CC3333';
              }}
            >
              Đăng nhập
            </a>
          )}
        </div>
      </aside>
    </>
  );
}

function DashboardHome() {
  const { data: grammarBoards = [] } = useQuery({
    queryKey: ['boards', 'grammar'],
    queryFn: async () => {
      const response = await fetch('/api/boards?type=grammar');
      if (!response.ok) throw new Error('Failed to fetch grammar boards');
      return response.json();
    },
  });

  const { data: vocabularyBoards = [] } = useQuery({
    queryKey: ['boards', 'vocabulary'],
    queryFn: async () => {
      const response = await fetch('/api/boards?type=vocabulary');
      if (!response.ok) throw new Error('Failed to fetch vocabulary boards');
      return response.json();
    },
  });

  const { data: idiomsBoards = [] } = useQuery({
    queryKey: ['boards', 'idioms'],
    queryFn: async () => {
      const response = await fetch('/api/boards?type=idioms');
      if (!response.ok) throw new Error('Failed to fetch idioms boards');
      return response.json();
    },
  });

  const stats = [
    {
      title: 'Grammar',
      count: grammarBoards.length,
      icon: <BookOpen className="w-8 h-8" />,
      link: '/dashboard/grammar',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverBorder: 'hover:border-blue-300',
    },
    {
      title: 'Vocabulary',
      count: vocabularyBoards.length,
      icon: <FileText className="w-8 h-8" />,
      link: '/dashboard/vocabulary',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      hoverBorder: 'hover:border-green-300',
    },
    {
      title: 'Idioms',
      count: idiomsBoards.length,
      icon: <MessageSquare className="w-8 h-8" />,
      link: '/dashboard/expressions',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      hoverBorder: 'hover:border-amber-300',
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Dashboard</h1>
          <p className="text-lg text-gray-600">Chào mừng trở lại! Tiếp tục hành trình học IELTS của bạn.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              to={stat.link}
              className="bg-white rounded border border-gray-200 p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-500">boards</div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{stat.title}</h3>
            </Link>
          ))}
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Tiến độ học tập</h2>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full">
              Coming Soon
            </span>
          </div>
          
          <div className="space-y-6">
            {/* Grammar Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-900" />
                  <span className="font-semibold text-gray-900">Grammar</span>
                </div>
                <span className="text-sm text-gray-500">0 / {grammarBoards.length} boards</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-900 h-3 rounded-full transition-all duration-300"
                  style={{ width: '0%' }}
                ></div>
              </div>
            </div>

            {/* Vocabulary Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-900" />
                  <span className="font-semibold text-gray-900">Vocabulary</span>
                </div>
                <span className="text-sm text-gray-500">0 / {vocabularyBoards.length} boards</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-900 h-3 rounded-full transition-all duration-300"
                  style={{ width: '0%' }}
                ></div>
              </div>
            </div>

            {/* Idioms Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-900" />
                  <span className="font-semibold text-gray-900">Idioms</span>
                </div>
                <span className="text-sm text-gray-500">0 / {idiomsBoards.length} boards</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-900 h-3 rounded-full transition-all duration-300"
                  style={{ width: '0%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Tính năng theo dõi tiến độ đang được phát triển. Sẽ sớm ra mắt!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VocabularyBoardPage() {
  const { id } = useParams();
  return <VocabularyBoardDetail boardId={id!} />;
}

function GrammarBoardPage() {
  const { id } = useParams();
  return <GrammarBoardDetail boardId={id!} />;
}

function ExpressionsBoardPage() {
  const { id } = useParams();
  return <ExpressionsBoardDetail boardId={id!} />;
}

function DashboardContent({ initialIsAdmin }: { initialIsAdmin: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  
  // Fetch user data from API
  const { data: userData } = useQuery({
    queryKey: ['user-data'],
    queryFn: fetchUserData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const isAdmin = userData?.isAdmin ?? initialIsAdmin;
  const username = userData?.username ?? undefined;
  const isLoggedIn = userData?.isLoggedIn ?? false;

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <AdminProvider isAdmin={isAdmin}>
      <DataPrefetcher />
      <BrowserRouter>
        <div className="min-h-screen flex bg-white">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)}
            isAdmin={isAdmin}
            username={username}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
          
          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-2 flex items-center gap-5">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-black">
              My <span style={{ color: '#FF6B6B' }}>IELTS</span>
            </h1>
          </div>

          <main className="flex-1 lg:ml-[250px] pt-16 lg:pt-0">
            <Routes>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/grammar" element={<GrammarBoardsGrid />} />
              <Route path="/dashboard/grammar/:id" element={<GrammarBoardPage />} />
              <Route path="/dashboard/vocabulary" element={<VocabularyBoardsGrid />} />
              <Route path="/dashboard/vocabulary/:id" element={<VocabularyBoardPage />} />
              <Route path="/dashboard/expressions" element={<ExpressionsBoardsGrid />} />
              <Route path="/dashboard/expressions/:id" element={<ExpressionsBoardPage />} />
            </Routes>
          </main>

          {/* Logout Confirmation Dialog */}
          <LogoutConfirmDialog
            isOpen={logoutDialogOpen}
            onClose={() => setLogoutDialogOpen(false)}
            onConfirm={confirmLogout}
          />
        </div>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default function DashboardSPA({ isAdmin: initialIsAdmin = false }: DashboardSPAProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent initialIsAdmin={initialIsAdmin} />
    </QueryClientProvider>
  );
}
