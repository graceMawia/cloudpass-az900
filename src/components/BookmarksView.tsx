import React, { useState } from 'react';
import { QUESTIONS, TOPIC_INFO } from '../data/questions';
import {
  Bookmark,
  BookmarkCheck,
  Play,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface BookmarksViewProps {
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
  onStartPracticeWithBookmarks: () => void;
  onBack: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedIds,
  onToggleBookmark,
  onStartPracticeWithBookmarks,
  onBack,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bookmarkedQuestions = QUESTIONS.filter((q) => bookmarkedIds.includes(q.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {bookmarkedQuestions.length > 0 && (
          <button
            onClick={onStartPracticeWithBookmarks}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Practice These {bookmarkedQuestions.length} Questions
          </button>
        )}
      </div>

      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-amber-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Saved Tricky Questions ({bookmarkedQuestions.length})
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review questions you flagged for extra revision, complete with explanations and real-world analogies.
        </p>
      </div>

      {/* Empty State */}
      {bookmarkedQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              No saved questions yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              While taking quizzes, tap the bookmark icon on any tricky question to save it here for targeted revision before the exam.
            </p>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Go to Practice
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarkedQuestions.map((q, index) => {
            const isExpanded = expandedId === q.id;
            const topic = TOPIC_INFO[q.topic];

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 transition-all"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${topic.color.badge}`}>
                        {topic.shortName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {q.subtopic}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(q.id);
                      }}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-4">
                    {/* Correct answer display */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs sm:text-sm text-emerald-950 flex items-start gap-2.5 mt-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Correct Answer: </span>
                        <span>{q.options[q.correctAnswerIndex]}</span>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Explanation
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>

                      {q.kenyanAnalogy && (
                        <div className="bg-amber-500/10 border border-amber-300/40 rounded-lg p-3 text-xs text-amber-950">
                          <span className="font-bold block mb-1">🇰🇪 Kenyan Everyday Analogy:</span>
                          <p className="leading-relaxed">{q.kenyanAnalogy}</p>
                        </div>
                      )}

                      <div className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-lg border border-blue-200">
                        <span className="font-bold">Key Takeaway: </span>
                        {q.keyTakeaway}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
