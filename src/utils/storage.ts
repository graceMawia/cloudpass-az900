import { UserProgress, QuizAttempt, TopicCategory } from '../types/quiz';
import { QUESTIONS, TOPIC_INFO } from '../data/questions';

const STORAGE_KEY = 'cloudpass_az900_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  attempts: [],
  questionStats: {},
  bookmarkedQuestionIds: [],
  totalQuizzesCompleted: 0,
  lastActiveTimestamp: Date.now(),
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw) as UserProgress;
    return {
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
      questionStats: parsed.questionStats && typeof parsed.questionStats === 'object' ? parsed.questionStats : {},
      bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds) ? parsed.bookmarkedQuestionIds : [],
      totalQuizzesCompleted: typeof parsed.totalQuizzesCompleted === 'number' ? parsed.totalQuizzesCompleted : 0,
      lastActiveTimestamp: parsed.lastActiveTimestamp || Date.now(),
    };
  } catch (err) {
    console.error('Failed to load CloudPass progress from localStorage:', err);
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save CloudPass progress to localStorage:', err);
  }
}

export function recordQuizAttempt(attempt: QuizAttempt): UserProgress {
  const current = loadProgress();
  const updatedQuestionStats = { ...current.questionStats };

  attempt.answers.forEach((ans) => {
    const prev = updatedQuestionStats[ans.questionId] || {
      timesAttempted: 0,
      timesCorrect: 0,
      lastAnswered: 0,
      lastResult: 'incorrect',
    };

    updatedQuestionStats[ans.questionId] = {
      timesAttempted: prev.timesAttempted + 1,
      timesCorrect: prev.timesCorrect + (ans.isCorrect ? 1 : 0),
      lastAnswered: ans.timestamp,
      lastResult: ans.isCorrect ? 'correct' : 'incorrect',
    };
  });

  const updatedProgress: UserProgress = {
    ...current,
    attempts: [attempt, ...current.attempts].slice(0, 50), // keep latest 50
    questionStats: updatedQuestionStats,
    totalQuizzesCompleted: current.totalQuizzesCompleted + 1,
    lastActiveTimestamp: Date.now(),
  };

  saveProgress(updatedProgress);
  return updatedProgress;
}

export function toggleQuestionBookmark(questionId: string): { updatedProgress: UserProgress; isBookmarked: boolean } {
  const current = loadProgress();
  const exists = current.bookmarkedQuestionIds.includes(questionId);
  const updatedBookmarks = exists
    ? current.bookmarkedQuestionIds.filter((id) => id !== questionId)
    : [...current.bookmarkedQuestionIds, questionId];

  const updatedProgress: UserProgress = {
    ...current,
    bookmarkedQuestionIds: updatedBookmarks,
  };

  saveProgress(updatedProgress);
  return { updatedProgress, isBookmarked: !exists };
}

export function resetAllProgress(): UserProgress {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_PROGRESS;
}

export interface TopicMetric {
  topic: TopicCategory;
  name: string;
  weight: string;
  totalQuestionsInBank: number;
  uniqueAttempted: number;
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  status: 'mastered' | 'practicing' | 'needs-revision' | 'unattempted';
}

export function getTopicMetrics(progress: UserProgress): Record<TopicCategory, TopicMetric> {
  const categories: TopicCategory[] = ['cloud-concepts', 'azure-architecture', 'azure-governance'];

  const result = {} as Record<TopicCategory, TopicMetric>;

  categories.forEach((topic) => {
    const topicQuestions = QUESTIONS.filter((q) => q.topic === topic);
    const totalInBank = topicQuestions.length;

    let totalAttempts = 0;
    let totalCorrect = 0;
    let uniqueAttempted = 0;

    topicQuestions.forEach((q) => {
      const stat = progress.questionStats[q.id];
      if (stat && stat.timesAttempted > 0) {
        uniqueAttempted += 1;
        totalAttempts += stat.timesAttempted;
        totalCorrect += stat.timesCorrect;
      }
    });

    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

    let status: 'mastered' | 'practicing' | 'needs-revision' | 'unattempted' = 'unattempted';
    if (totalAttempts === 0) {
      status = 'unattempted';
    } else if (accuracy >= 80 && uniqueAttempted >= Math.ceil(totalInBank * 0.6)) {
      status = 'mastered';
    } else if (accuracy < 70) {
      status = 'needs-revision';
    } else {
      status = 'practicing';
    }

    result[topic] = {
      topic,
      name: TOPIC_INFO[topic].name,
      weight: TOPIC_INFO[topic].weightRange,
      totalQuestionsInBank: totalInBank,
      uniqueAttempted,
      totalAttempts,
      totalCorrect,
      accuracy,
      status,
    };
  });

  return result;
}

export interface OverallReadiness {
  totalAnswered: number;
  uniqueAnsweredCount: number;
  totalQuestionsInBank: number;
  overallAccuracy: number;
  readinessScore: number; // 0 - 100
  tier: 'Ready for Exam' | 'High Readiness' | 'Moderate' | 'Just Starting';
  badgeColor: string;
  weakTopics: TopicCategory[];
  suggestedAction: {
    title: string;
    description: string;
    targetMode: 'full' | 'quick' | 'topic' | 'weak-areas' | 'bookmarks';
    topicFilter?: TopicCategory;
    ctaLabel: string;
  };
}

export function calculateReadiness(progress: UserProgress): OverallReadiness {
  const topicMetrics = getTopicMetrics(progress);
  const totalQuestionsInBank = QUESTIONS.length;

  let totalAttempts = 0;
  let totalCorrect = 0;
  let uniqueAnsweredCount = 0;

  Object.values(progress.questionStats).forEach((stat) => {
    if (stat.timesAttempted > 0) {
      uniqueAnsweredCount += 1;
      totalAttempts += stat.timesAttempted;
      totalCorrect += stat.timesCorrect;
    }
  });

  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const coverageRatio = totalQuestionsInBank > 0 ? uniqueAnsweredCount / totalQuestionsInBank : 0;

  // Readiness score is 60% accuracy + 40% question coverage
  const readinessScore = totalAttempts === 0 ? 0 : Math.min(100, Math.round(overallAccuracy * 0.65 + coverageRatio * 100 * 0.35));

  const weakTopics: TopicCategory[] = [];
  (Object.keys(topicMetrics) as TopicCategory[]).forEach((topic) => {
    const metric = topicMetrics[topic];
    if (metric.status === 'needs-revision' || (metric.totalAttempts > 0 && metric.accuracy < 70)) {
      weakTopics.push(topic);
    }
  });

  let tier: 'Ready for Exam' | 'High Readiness' | 'Moderate' | 'Just Starting' = 'Just Starting';
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';

  if (readinessScore >= 80 && uniqueAnsweredCount >= 16) {
    tier = 'Ready for Exam';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  } else if (readinessScore >= 65 && uniqueAnsweredCount >= 10) {
    tier = 'High Readiness';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
  } else if (totalAttempts > 0) {
    tier = 'Moderate';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  }

  // Determine suggested action
  let suggestedAction: OverallReadiness['suggestedAction'];

  if (totalAttempts === 0) {
    suggestedAction = {
      title: 'Take your first diagnostic practice session',
      description: 'Start with a 10-question sprint across all 3 AZ-900 domains to assess your baseline knowledge.',
      targetMode: 'quick',
      ctaLabel: 'Start 10-Question Sprint',
    };
  } else if (weakTopics.length > 0) {
    const weakestTopic = weakTopics.sort((a, b) => topicMetrics[a].accuracy - topicMetrics[b].accuracy)[0];
    suggestedAction = {
      title: `Revise weak topic: ${TOPIC_INFO[weakestTopic].shortName}`,
      description: `Your accuracy is currently ${topicMetrics[weakestTopic].accuracy}%. Practice focused questions in this domain to reach the 70% passing threshold.`,
      targetMode: 'topic',
      topicFilter: weakestTopic,
      ctaLabel: `Practice ${TOPIC_INFO[weakestTopic].shortName}`,
    };
  } else if (uniqueAnsweredCount < totalQuestionsInBank) {
    suggestedAction = {
      title: 'Expand question coverage with a Full Practice Exam',
      description: `You have practiced ${uniqueAnsweredCount} of ${totalQuestionsInBank} questions. Complete a full simulation to test unseen concepts.`,
      targetMode: 'full',
      ctaLabel: 'Start Full 15-Question Exam',
    };
  } else {
    suggestedAction = {
      title: 'Maintain your readiness with a Quick Refresh',
      description: 'Outstanding work! All domains are performing above passing standard. Keep concepts fresh before test day.',
      targetMode: 'quick',
      ctaLabel: 'Start Quick 10-Question Sprint',
    };
  }

  return {
    totalAnswered: totalAttempts,
    uniqueAnsweredCount,
    totalQuestionsInBank,
    overallAccuracy,
    readinessScore,
    tier,
    badgeColor,
    weakTopics,
    suggestedAction,
  };
}
