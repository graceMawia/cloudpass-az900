import React, { useState } from 'react';
import { QuizAttempt, TopicCategory, Question } from '../types/quiz';
import { QUESTIONS, TOPIC_INFO } from '../data/questions';
import {
  Award,
  RotateCcw,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Target,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface ResultsViewProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onPracticeWeakAreas: (topic?: TopicCategory) => void;
  onBackToDashboard: () => void;
  onViewResources: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  attempt,
  onRetake,
  onPracticeWeakAreas,
  onBackToDashboard,
  onViewResources,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'bookmarked'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  const isPassed = attempt.scorePercentage >= 70;

  // Identify topics below 70%
  const categories: TopicCategory[] = [
    'cloud-concepts',
    'azure-architecture',
    'azure-governance',
  ];

  const topicsToRevise: { topic: TopicCategory; accuracy: number; total: number; correct: number }[] = [];

  categories.forEach((cat) => {
    const stat = attempt.topicScores[cat];
    if (stat && stat.total > 0) {
      const acc = Math.round((stat.correct / stat.total) * 100);
      if (acc < 70) {
        topicsToRevise.push({
          topic: cat,
          accuracy: acc,
          total: stat.total,
          correct: stat.correct,
        });
      }
    }
  });

  // Questions in this attempt
  const attemptQuestions = attempt.answers
    .map((ans) => {
      const q = QUESTIONS.find((item) => item.id === ans.questionId);
      return {
        question: q as Question,
        userAnswer: ans,
      };
    })
    .filter((item) => item.question !== undefined);

  const filteredQuestions = attemptQuestions.filter((item) => {
    if (filter === 'incorrect') return !item.userAnswer.isCorrect;
    if (filter === 'bookmarked') return bookmarkedIds.includes(item.question.id);
    return true;
  });

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Score Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 shadow-sm text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-4">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg ${
              isPassed
                ? 'bg-emerald-100 text-emerald-600 shadow-emerald-500/20'
                : 'bg-rose-100 text-rose-600 shadow-rose-500/20'
            }`}
          >
            {isPassed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
          </div>

          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                isPassed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {isPassed ? 'Passing Score Achieved' : 'Below 70% Passing Threshold'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              You Scored {attempt.scorePercentage}%
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {attempt.correctAnswers} of {attempt.totalQuestions} questions correct • AZ-900 benchmark is 700 / 1000 (70%)
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
            {isPassed
              ? 'Excellent performance! You demonstrate solid readiness for the fundamental concepts tested in Microsoft AZ-900.'
              : 'Good effort! Azure Fundamentals covers broad concepts. Review the explanations below and drill your weak areas to reach 70%+.'}
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
            <button
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={onViewResources}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              Official Guide
            </button>
          </div>
        </div>
      </div>

      {/* Accuracy by Topic & Revision Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((catKey) => {
          const info = TOPIC_INFO[catKey];
          const stat = attempt.topicScores[catKey];
          if (!stat || stat.total === 0) return null;

          const acc = Math.round((stat.correct / stat.total) * 100);
          const passedTopic = acc >= 70;

          return (
            <div
              key={catKey}
              className={`rounded-2xl p-5 border shadow-xs bg-white ${
                passedTopic ? 'border-slate-200' : 'border-rose-200 ring-1 ring-rose-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-500">{info.shortName}</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                    passedTopic
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {acc}%
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${passedTopic ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${acc}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                <span>
                  {stat.correct} of {stat.total} correct
                </span>
                <span>Exam weight: {info.weightRange}</span>
              </div>

              {!passedTopic && (
                <button
                  onClick={() => onPracticeWeakAreas(catKey)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  Drill {info.shortName}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested Next Action Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Suggested Next Study Action
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {topicsToRevise.length > 0
                ? `Revise ${TOPIC_INFO[topicsToRevise[0].topic].name}`
                : 'Consolidate Knowledge with Another Full Exam'}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {topicsToRevise.length > 0
                ? `You missed questions in ${TOPIC_INFO[topicsToRevise[0].topic].shortName}. Review the detailed question explanations below and take a targeted drill before testing again.`
                : 'Great mastery across all tested domains. Practice once more to reinforce speed and confidence under real exam timing.'}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            topicsToRevise.length > 0
              ? onPracticeWeakAreas(topicsToRevise[0].topic)
              : onRetake()
          }
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs sm:text-sm shrink-0 transition-colors cursor-pointer"
        >
          <span>{topicsToRevise.length > 0 ? 'Drill This Topic' : 'Retake Practice'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Detailed Question Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Detailed Question Review ({filteredQuestions.length})
            </h2>
            <p className="text-xs text-slate-500">
              Click any question to view full explanations, distractors, and Kenyan analogies.
            </p>
          </div>

          {/* Review Filter Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({attemptQuestions.length})
            </button>
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'incorrect'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Missed ({attemptQuestions.filter((item) => !item.userAnswer.isCorrect).length})
            </button>
            <button
              onClick={() => setFilter('bookmarked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === 'bookmarked'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Saved ({attemptQuestions.filter((item) => bookmarkedIds.includes(item.question.id)).length})
            </button>
          </div>
        </div>

        {/* Questions Accordion List */}
        <div className="space-y-3">
          {filteredQuestions.map(({ question: q, userAnswer: ans }, index) => {
            const isExpanded = expandedQuestionId === q.id;
            const isBookmarked = bookmarkedIds.includes(q.id);
            const isCorrect = ans.isCorrect;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isCorrect ? 'border-slate-200' : 'border-rose-200'
                }`}
              >
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5 shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Question {index + 1}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {q.subtopic}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isCorrect
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Missed'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 leading-snug">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(q.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-50 text-amber-600 border-amber-300'
                          : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
                      }`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-4">
                    {/* Answers Comparison */}
                    <div className="space-y-2 pt-3">
                      {q.options.map((opt, optIdx) => {
                        const isUserAnswer = ans.selectedOptionIndex === optIdx;
                        const isCorrectAnswer = q.correctAnswerIndex === optIdx;

                        let style = 'bg-white text-slate-700 border-slate-200';
                        if (isCorrectAnswer) {
                          style = 'bg-emerald-50 text-emerald-950 border-emerald-400 font-medium';
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          style = 'bg-rose-50 text-rose-950 border-rose-400 font-medium line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${style}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold">{optionLabels[optIdx]}.</span>
                              <span>{opt}</span>
                            </div>
                            <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold">
                              {isCorrectAnswer && (
                                <span className="text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                                </span>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <span className="text-rose-700 flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> Your Choice
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation & Analogy */}
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
                        <span className="font-bold">Exam Takeaway: </span>
                        {q.keyTakeaway}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
