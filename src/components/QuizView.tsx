import React, { useState, useEffect } from 'react';
import { Question, AnswerRecord, QuizAttempt, TopicCategory, QuizConfig } from '../types/quiz';
import { TOPIC_INFO } from '../data/questions';
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  Flag,
} from 'lucide-react';

interface QuizViewProps {
  questions: Question[];
  config: QuizConfig;
  onFinishQuiz: (attempt: QuizAttempt) => void;
  onExitQuiz: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  config,
  onFinishQuiz,
  onExitQuiz,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showDistractors, setShowDistractors] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const currentQuestion = questions[currentIndex];
  const isBookmarked = bookmarkedIds.includes(currentQuestion?.id);
  const isLastQuestion = currentIndex === questions.length - 1;

  // Reset state on question change
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowDistractors(false);
  }, [currentIndex]);

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No questions available for this practice session.</p>
        <button
          onClick={onExitQuiz}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const topic = TOPIC_INFO[currentQuestion.topic];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    const newRecord: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedOptionIndex: index,
      isCorrect,
      timestamp: Date.now(),
    };

    setAnswers((prev) => [...prev, newRecord]);
  };

  const handleNext = () => {
    if (!isAnswered) return;

    if (isLastQuestion) {
      // Calculate final quiz attempt summary
      const finalAnswers = [...answers];
      const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
      const scorePct = Math.round((correctCount / questions.length) * 100);

      const topicScores = {
        'cloud-concepts': { total: 0, correct: 0 },
        'azure-architecture': { total: 0, correct: 0 },
        'azure-governance': { total: 0, correct: 0 },
      };

      questions.forEach((q) => {
        const ans = finalAnswers.find((a) => a.questionId === q.id);
        if (ans) {
          topicScores[q.topic].total += 1;
          if (ans.isCorrect) {
            topicScores[q.topic].correct += 1;
          }
        }
      });

      const attempt: QuizAttempt = {
        id: `attempt_${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        timestamp: Date.now(),
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        scorePercentage: scorePct,
        mode: config.mode,
        topicFilter: config.topicFilter,
        topicScores,
        answers: finalAnswers,
      };

      onFinishQuiz(attempt);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const currentCorrectCount = answers.filter((a) => a.isCorrect).length;
  const progressPercentage = Math.round(((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100);

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Quiz Top Navigation Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (answers.length > 0) {
                if (window.confirm('Leave practice session? Current session progress will not be saved as a completed test.')) {
                  onExitQuiz();
                }
              } else {
                onExitQuiz();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Session</span>
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${topic.color.badge}`}>
              {topic.shortName}
            </span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Q{currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-500 font-medium">Score: </span>
              <span className="text-xs font-bold text-slate-900">
                {currentCorrectCount} / {answers.length}
              </span>
            </div>

            <button
              onClick={() => onToggleBookmark(currentQuestion.id)}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'bg-slate-50 text-slate-400 hover:text-slate-700 border-slate-200'
              }`}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Subtopic & Kenyan Relatable Scenario */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {currentQuestion.subtopic}
            </span>
          </div>

          {currentQuestion.scenario && (
            <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-semibold text-slate-900">Scenario Context: </span>
                {currentQuestion.scenario}
              </p>
            </div>
          )}

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options List */}
        <div className="space-y-3" role="radiogroup" aria-label="Answer options">
          {currentQuestion.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === currentQuestion.correctAnswerIndex;

            let buttonStyle = 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800';
            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
            let icon = null;

            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20';
                badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
              } else if (isSelected && !isCorrectOption) {
                buttonStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-500/20';
                badgeStyle = 'bg-rose-600 text-white border-rose-600';
                icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
              } else {
                buttonStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer disabled:cursor-default ${buttonStyle}`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${badgeStyle}`}
                  >
                    {optionLabels[idx]}
                  </span>
                  <span className="text-sm sm:text-base font-medium leading-relaxed pt-0.5">
                    {optionText}
                  </span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Feedback & Explanation Section */}
        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-5 animate-in fade-in duration-200">
            {/* Instant Result Header Banner */}
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 ${
                selectedOption === currentQuestion.correctAnswerIndex
                  ? 'bg-emerald-100/90 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100/90 text-rose-900 border border-rose-300'
              }`}
            >
              {selectedOption === currentQuestion.correctAnswerIndex ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-700 shrink-0" />
              )}
              <div>
                <p className="font-extrabold text-sm sm:text-base">
                  {selectedOption === currentQuestion.correctAnswerIndex
                    ? 'Correct! Great cloud instinct.'
                    : 'Incorrect. Review the concept below.'}
                </p>
                <p className="text-xs opacity-90">
                  {selectedOption === currentQuestion.correctAnswerIndex
                    ? 'You selected the exact recommended architectural solution.'
                    : `The correct answer was: (${optionLabels[currentQuestion.correctAnswerIndex]}) ${
                        currentQuestion.options[currentQuestion.correctAnswerIndex]
                      }`}
                </p>
              </div>
            </div>

            {/* In-depth Conceptual Explanation */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  Conceptual Explanation
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Kenyan Everyday Analogy Callout */}
              {currentQuestion.kenyanAnalogy && (
                <div className="bg-amber-500/10 border border-amber-400/40 rounded-xl p-4 text-xs sm:text-sm text-amber-950">
                  <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                    <span className="text-base">🇰🇪</span>
                    <span>Kenyan Real-World Analogy</span>
                  </div>
                  <p className="leading-relaxed text-amber-900/90">
                    {currentQuestion.kenyanAnalogy}
                  </p>
                </div>
              )}

              {/* Key Exam Takeaway */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">AZ-900 Exam Takeaway: </span>
                  <span className="leading-relaxed">{currentQuestion.keyTakeaway}</span>
                </div>
              </div>

              {/* Distractor Breakdown Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowDistractors(!showDistractors)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer pt-1"
                >
                  <span>{showDistractors ? 'Hide' : 'Show'} why other options are incorrect</span>
                  {showDistractors ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showDistractors && (
                  <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                    {currentQuestion.distractorExplanations.map((text, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-2.5 rounded-lg border leading-relaxed ${
                          idx === currentQuestion.correctAnswerIndex
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="font-bold mr-1.5">Option {optionLabels[idx]}:</span>
                        {text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Next / Finish Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-md transition-colors cursor-pointer"
              >
                <span>{isLastQuestion ? 'Complete Quiz & View Score' : 'Next Question'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
