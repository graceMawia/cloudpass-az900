export type TopicCategory = 
  | 'cloud-concepts' 
  | 'azure-architecture' 
  | 'azure-governance';

export interface TopicInfo {
  id: TopicCategory;
  name: string;
  shortName: string;
  weightRange: string;
  description: string;
  iconName: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    bar: string;
  };
}

export interface Question {
  id: string;
  topic: TopicCategory;
  subtopic: string;
  question: string;
  scenario?: string;
  options: [string, string, string, string];
  correctAnswerIndex: number; // 0, 1, 2, or 3
  explanation: string;
  distractorExplanations: [string, string, string, string];
  kenyanAnalogy?: string;
  keyTakeaway: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timestamp: number;
}

export interface QuizAttempt {
  id: string;
  date: string;
  timestamp: number;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  mode: 'full' | 'quick' | 'topic' | 'weak-areas' | 'bookmarks';
  topicFilter?: TopicCategory;
  topicScores: Record<TopicCategory, { total: number; correct: number }>;
  answers: AnswerRecord[];
}

export interface QuestionStat {
  timesAttempted: number;
  timesCorrect: number;
  lastAnswered: number;
  lastResult: 'correct' | 'incorrect';
}

export interface UserProgress {
  attempts: QuizAttempt[];
  questionStats: Record<string, QuestionStat>;
  bookmarkedQuestionIds: string[];
  totalQuizzesCompleted: number;
  lastActiveTimestamp: number;
}

export type ViewMode = 'dashboard' | 'quiz' | 'results' | 'resources' | 'bookmarks';

export interface QuizConfig {
  mode: 'full' | 'quick' | 'topic' | 'weak-areas' | 'bookmarks';
  topicFilter?: TopicCategory;
  questionCount: number;
}
