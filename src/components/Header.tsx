import React from 'react';
import { ViewMode } from '../types/quiz';
import { Cloud, BookOpen, Bookmark, RotateCcw, LayoutDashboard, ShieldCheck, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  bookmarkCount: number;
  onOpenResetModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  bookmarkCount,
  onOpenResetModal,
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
      {/* Prominent Independent Project Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-xs px-4 py-2 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 flex-wrap text-center sm:text-left">
          <p className="w-full sm:w-auto text-amber-100/90 text-xs sm:text-sm">
            <span className="font-semibold text-amber-300">Notice:</span> CloudPass is an independent, unofficial AZ-900 learning project. It is not affiliated with, endorsed by, or sponsored by Microsoft.
          </p>
          <a
            href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-300 hover:text-white underline text-xs transition-colors shrink-0"
          >
            Official Microsoft Study Guide
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1 transition-transform active:scale-95"
            aria-label="CloudPass Home"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:bg-blue-500 transition-colors">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  CloudPass
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  AZ-900
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Azure Fundamentals Readiness Coach
              </p>
            </div>
          </button>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('bookmarks')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                currentView === 'bookmarks'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden md:inline">Saved</span>
              {bookmarkCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {bookmarkCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('resources')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'resources'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Study Guide</span>
            </button>

            {/* Reset Progress Action */}
            <button
              onClick={onOpenResetModal}
              title="Reset All Progress"
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/40 border border-slate-700/60 hover:border-rose-800/60 transition-all ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
