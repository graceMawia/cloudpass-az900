import React from 'react';
import { UserProgress, TopicCategory, QuizConfig } from '../types/quiz';
import { TOPIC_INFO, QUESTIONS } from '../data/questions';
import { calculateReadiness, getTopicMetrics } from '../utils/storage';
import {
  Play,
  Zap,
  Target,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  History,
  TrendingUp,
  Bookmark,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onStartQuiz: (config: QuizConfig) => void;
  onViewResources: () => void;
  onViewBookmarks: () => void;
  onViewAttemptDetails: (attemptId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onStartQuiz,
  onViewResources,
  onViewBookmarks,
  onViewAttemptDetails,
}) => {
  const readiness = calculateReadiness(progress);
  const topicMetrics = getTopicMetrics(progress);

  const categories: TopicCategory[] = [
    'cloud-concepts',
    'azure-architecture',
    'azure-governance',
  ];

  const hasIncorrectQuestions = Object.values(progress.questionStats).some(
    (q) => q.lastResult === 'incorrect'
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-blue-900/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Official AZ-900 Syllabus Aligned
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            AZ-900 Microsoft Azure Readiness Coach
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Master cloud fundamentals with original practice questions, real-life analogies, instant feedback, and targeted domain accuracy analytics.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartQuiz({ mode: 'full', questionCount: 15 })}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              Start Full Practice Exam (15 Questions)
            </button>
            <button
              onClick={() => onStartQuiz({ mode: 'quick', questionCount: 10 })}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-medium text-sm sm:text-base border border-slate-700 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Quick 10-Question Sprint
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Suggested Next Action Banner */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm">
                Recommended Next Step
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {readiness.suggestedAction.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {readiness.suggestedAction.description}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            onStartQuiz({
              mode: readiness.suggestedAction.targetMode,
              topicFilter: readiness.suggestedAction.topicFilter,
              questionCount: readiness.suggestedAction.targetMode === 'topic' ? 8 : 10,
            })
          }
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          {readiness.suggestedAction.ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Readiness Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Index */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Readiness Score</span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${readiness.badgeColor}`}>
              {readiness.tier}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {readiness.readinessScore}%
            </span>
            <span className="text-xs text-slate-500">of goal (70% pass)</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                readiness.readinessScore >= 70 ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, readiness.readinessScore)}%` }}
            />
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {readiness.overallAccuracy}%
            </span>
            <span className="text-xs text-slate-500">
              {readiness.totalAnswered} answered
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 truncate">
            {readiness.overallAccuracy >= 70
              ? 'Above AZ-900 passing bar (70%)'
              : 'Aim for 70%+ across all topics'}
          </p>
        </div>

        {/* Question Bank Coverage */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Questions Practiced</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {readiness.uniqueAnsweredCount}
            </span>
            <span className="text-xs text-slate-500">
              / {readiness.totalQuestionsInBank} unique
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  (readiness.uniqueAnsweredCount / readiness.totalQuestionsInBank) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Practice Sessions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tests Completed</span>
            <History className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {progress.totalQuizzesCompleted}
            </span>
            <span className="text-xs text-slate-500">sessions</span>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {progress.bookmarkedQuestionIds.length} questions saved for review
          </p>
        </div>
      </section>

      {/* AZ-900 Topic Categories Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              AZ-900 Exam Topic Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Track your accuracy by domain and practice targeted question sets.
            </p>
          </div>
          {readiness.weakTopics.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              {readiness.weakTopics.length} topic(s) need revision
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categories.map((topicKey) => {
            const info = TOPIC_INFO[topicKey];
            const metric = topicMetrics[topicKey];

            return (
              <div
                key={topicKey}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Exam weight: {info.weightRange}
                    </span>
                    {metric.status === 'needs-revision' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                        Needs Revision
                      </span>
                    )}
                    {metric.status === 'mastered' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Mastered
                      </span>
                    )}
                    {metric.status === 'practicing' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                        Practicing
                      </span>
                    )}
                    {metric.status === 'unattempted' && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Not Started
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {info.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {info.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Domain Accuracy</span>
                      <span className="font-bold text-slate-900">
                        {metric.totalAttempts > 0 ? `${metric.accuracy}%` : 'N/A'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          metric.accuracy >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${metric.accuracy}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{metric.uniqueAttempted} / {metric.totalQuestionsInBank} questions practiced</span>
                      <span>{metric.totalCorrect} / {metric.totalAttempts} correct</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3">
                  <button
                    onClick={() =>
                      onStartQuiz({
                        mode: 'topic',
                        topicFilter: topicKey,
                        questionCount: metric.totalQuestionsInBank,
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Practice {info.shortName}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Study Modes Section */}
      <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          Targeted Practice Modes
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-5">
          Select a tailored study flow based on your current preparation goals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Full Exam Simulation */}
          <button
            onClick={() => onStartQuiz({ mode: 'full', questionCount: 15 })}
            className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
              Full 15-Question Exam
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Comprehensive test covering all 3 syllabus areas with 70% passing bar.
            </p>
          </button>

          {/* Weak Areas Drill */}
          <button
            onClick={() => onStartQuiz({ mode: 'weak-areas', questionCount: 10 })}
            disabled={!hasIncorrectQuestions}
            className={`text-left p-4 rounded-xl bg-white border transition-all group ${
              hasIncorrectQuestions
                ? 'border-slate-200 hover:border-rose-400 hover:shadow-md cursor-pointer'
                : 'border-slate-200 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Weak Areas Drill
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              {hasIncorrectQuestions
                ? 'Retry questions you previously missed until you achieve 100% mastery.'
                : 'No incorrect questions recorded yet. Take a quiz first!'}
            </p>
          </button>

          {/* Bookmarked Questions */}
          <button
            onClick={onViewBookmarks}
            className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Bookmark className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                Saved Questions
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {progress.bookmarkedQuestionIds.length}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Review flagged tricky questions and detailed Kenyan real-world analogies.
            </p>
          </button>
        </div>
      </section>

      {/* Recent Practice History */}
      {progress.attempts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            Recent Practice Attempts
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {progress.attempts.slice(0, 5).map((attempt) => {
              const passed = attempt.scorePercentage >= 70;
              return (
                <div
                  key={attempt.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        passed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {attempt.scorePercentage}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {attempt.mode === 'full'
                            ? 'Full Exam Simulation'
                            : attempt.mode === 'quick'
                            ? 'Quick 10 Sprint'
                            : attempt.mode === 'topic' && attempt.topicFilter
                            ? `${TOPIC_INFO[attempt.topicFilter].shortName} Drill`
                            : 'Practice Session'}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            passed
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {passed ? 'Passed (≥70%)' : 'Needs Practice'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {attempt.correctAnswers} of {attempt.totalQuestions} questions correct • {attempt.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewAttemptDetails(attempt.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span>Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Official Study Guide Resource Banner */}
      <section className="rounded-2xl p-6 bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            Official Learning Roadmap
          </div>
          <h3 className="text-lg font-bold text-white">
            Microsoft Certified: Azure Fundamentals (AZ-900)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Review Microsoft’s official exam guide, domain weights, and preparation checklist before scheduling your test.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={onViewResources}
            className="flex-1 md:flex-initial inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Study Guide & Tips
          </button>
          <a
            href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm transition-colors border border-slate-700"
          >
            Official Link
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};
