import React, { useState, useEffect } from 'react';
import { ViewMode, UserProgress, QuizConfig, QuizAttempt, Question, TopicCategory } from './types/quiz';
import { QUESTIONS } from './data/questions';
import {
  loadProgress,
  recordQuizAttempt,
  toggleQuestionBookmark,
  resetAllProgress,
  INITIAL_PROGRESS,
} from './utils/storage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { QuizView } from './components/QuizView';
import { ResultsView } from './components/ResultsView';
import { ResourcesView } from './components/ResourcesView';
import { BookmarksView } from './components/BookmarksView';
import { ResetConfirmModal } from './components/ResetConfirmModal';

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);
  const [activeConfig, setActiveConfig] = useState<QuizConfig>({
    mode: 'full',
    questionCount: 15,
  });
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Load progress from localStorage on initial render
  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
  }, []);

  const handleStartQuiz = (config: QuizConfig) => {
    let selected: Question[] = [];

    if (config.mode === 'topic' && config.topicFilter) {
      // Questions from the specified topic
      const topicQuestions = QUESTIONS.filter((q) => q.topic === config.topicFilter);
      selected = shuffleArray(topicQuestions).slice(0, config.questionCount || topicQuestions.length);
    } else if (config.mode === 'bookmarks') {
      const bookmarked = QUESTIONS.filter((q) => progress.bookmarkedQuestionIds.includes(q.id));
      selected = shuffleArray(bookmarked);
    } else if (config.mode === 'weak-areas') {
      // Priority 1: Questions learner got wrong last time
      const incorrectQuestions = QUESTIONS.filter(
        (q) => progress.questionStats[q.id]?.lastResult === 'incorrect'
      );
      // Priority 2: Questions not yet attempted
      const unattempted = QUESTIONS.filter(
        (q) => !progress.questionStats[q.id] || progress.questionStats[q.id].timesAttempted === 0
      );

      const pool = [...shuffleArray(incorrectQuestions), ...shuffleArray(unattempted)];
      selected = pool.slice(0, config.questionCount || 10);

      // Fallback if not enough
      if (selected.length < 5) {
        selected = shuffleArray(QUESTIONS).slice(0, 10);
      }
    } else if (config.mode === 'quick') {
      // 10 random questions across all topics
      selected = shuffleArray(QUESTIONS).slice(0, 10);
    } else {
      // Full Exam: Balanced 15 questions (5 from each of the 3 topics)
      const c1 = shuffleArray(QUESTIONS.filter((q) => q.topic === 'cloud-concepts')).slice(0, 5);
      const c2 = shuffleArray(QUESTIONS.filter((q) => q.topic === 'azure-architecture')).slice(0, 5);
      const c3 = shuffleArray(QUESTIONS.filter((q) => q.topic === 'azure-governance')).slice(0, 5);
      selected = shuffleArray([...c1, ...c2, ...c3]);
    }

    if (selected.length === 0) {
      selected = shuffleArray(QUESTIONS).slice(0, 10);
    }

    setActiveQuizQuestions(selected);
    setActiveConfig(config);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishQuiz = (attempt: QuizAttempt) => {
    const updated = recordQuizAttempt(attempt);
    setProgress(updated);
    setCurrentAttempt(attempt);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (questionId: string) => {
    const { updatedProgress } = toggleQuestionBookmark(questionId);
    setProgress(updatedProgress);
  };

  const handleViewAttemptDetails = (attemptId: string) => {
    const found = progress.attempts.find((a) => a.id === attemptId);
    if (found) {
      setCurrentAttempt(found);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmReset = () => {
    const fresh = resetAllProgress();
    setProgress(fresh);
    setIsResetModalOpen(false);
    setCurrentAttempt(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bookmarkCount={progress.bookmarkedQuestionIds.length}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            progress={progress}
            onStartQuiz={handleStartQuiz}
            onViewResources={() => {
              setCurrentView('resources');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewBookmarks={() => {
              setCurrentView('bookmarks');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewAttemptDetails={handleViewAttemptDetails}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView
            questions={activeQuizQuestions}
            config={activeConfig}
            onFinishQuiz={handleFinishQuiz}
            onExitQuiz={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            bookmarkedIds={progress.bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'results' && currentAttempt && (
          <ResultsView
            attempt={currentAttempt}
            onRetake={() =>
              handleStartQuiz({
                mode: currentAttempt.mode,
                topicFilter: currentAttempt.topicFilter,
                questionCount: currentAttempt.totalQuestions,
              })
            }
            onPracticeWeakAreas={(topic?: TopicCategory) =>
              handleStartQuiz({
                mode: topic ? 'topic' : 'weak-areas',
                topicFilter: topic,
                questionCount: 8,
              })
            }
            onBackToDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewResources={() => {
              setCurrentView('resources');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            bookmarkedIds={progress.bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'resources' && (
          <ResourcesView
            onBack={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartPractice={() => handleStartQuiz({ mode: 'full', questionCount: 15 })}
          />
        )}

        {currentView === 'bookmarks' && (
          <BookmarksView
            bookmarkedIds={progress.bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
            onStartPracticeWithBookmarks={() => handleStartQuiz({ mode: 'bookmarks', questionCount: progress.bookmarkedQuestionIds.length })}
            onBack={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Confirmation Modal for Resetting Progress */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CloudPass</span>
            <span>—</span>
            <span>AZ-900 Readiness Coach</span>
          </div>
          <p className="text-center sm:text-right text-slate-400 max-w-xl">
            Independent, unofficial learning tool. Not affiliated with, endorsed by, or sponsored by Microsoft.
          </p>
        </div>
      </footer>
    </div>
  );
}
