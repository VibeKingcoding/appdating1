export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  PLACEMENT_TEST = 'PLACEMENT_TEST',
  CURRICULUM = 'CURRICULUM',
  LESSON_DETAIL = 'LESSON_DETAIL',
  GRADUATION = 'GRADUATION',
}

export enum Rank {
  RECRUIT = 'Lính Mới',
  PRIVATE = 'Binh Nhì',
  CORPORAL = 'Hạ Sĩ',
  SERGEANT = 'Trung Sĩ',
  CAPTAIN = 'Đại Úy Tình Trường',
}

export interface UserProfile {
  name: string;
  rank: Rank;
  unlockedLessonId: number;
  completedLessons: number[];
  score: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  isLocked: boolean;
  theory?: string;
  scenarioPrompt?: string;
}

export interface ScenarioContent {
  situation: string;
  imageUrl: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  dialogue: {
    speaker: 'Nam' | 'Nữ';
    text: string;
  }[];
}

export interface DailyBriefing {
  quote: string;
  imageUrl: string;
}
