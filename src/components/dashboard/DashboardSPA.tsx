import { BrowserRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
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
import { Home, BookOpen, FileText, MessageSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface DashboardSPAProps {
  isAdmin?: boolean;
}

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
        w-[250px] bg-white border-r border-gray-200 fixed h-screen overflow-y-auto z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden absolute top-4 right-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold">
            My <span style={{ color: '#FF6B6B' }}>IELTS</span>
          </h1>
        </div>

        <nav className="p-4">
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
              
              <button 
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 rounded hover:bg-gray-50 text-left mb-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Tạo bộ từ mới
              </button>

              <div className="border-t border-gray-200 my-2"></div>

              <BoardsList type={boardType} />
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

function DashboardHome() {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-xl text-gray-600">Welcome back! Continue your IELTS learning journey.</p>
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

export default function DashboardSPA({ isAdmin = false }: DashboardSPAProps) {
  const queryClient = getQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider isAdmin={isAdmin}>
        <DataPrefetcher />
        <BrowserRouter>
          <div className="min-h-screen flex bg-white">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-2 flex items-center gap-5">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-bold">
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
          </div>
        </BrowserRouter>
      </AdminProvider>
    </QueryClientProvider>
  );
}
