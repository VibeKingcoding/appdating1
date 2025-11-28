import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Rank, UserProfile, ViewState, Lesson } from './types';
import { INITIAL_LESSONS, RANK_THRESHOLDS } from './constants';

interface AppState {
  user: UserProfile | null;
  view: ViewState;
  lessons: Lesson[];
  
  // Actions
  setUser: (name: string) => void;
  updateRank: (scoreToAdd: number) => void;
  completeLesson: (lessonId: number) => void;
  setView: (view: ViewState) => void;
  unlockNextLesson: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      view: ViewState.LOGIN,
      lessons: INITIAL_LESSONS,

      setUser: (name) => set({
        user: {
          name,
          rank: Rank.RECRUIT,
          unlockedLessonId: 1,
          completedLessons: [],
          score: 0
        },
        view: ViewState.DASHBOARD
      }),

      updateRank: (scoreToAdd) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const newScore = currentUser.score + scoreToAdd;
        let newRank = currentUser.rank;

        // Simple rank logic based on constants
        if (newScore >= RANK_THRESHOLDS[Rank.CAPTAIN]) newRank = Rank.CAPTAIN;
        else if (newScore >= RANK_THRESHOLDS[Rank.SERGEANT]) newRank = Rank.SERGEANT;
        else if (newScore >= RANK_THRESHOLDS[Rank.CORPORAL]) newRank = Rank.CORPORAL;
        else if (newScore >= RANK_THRESHOLDS[Rank.PRIVATE]) newRank = Rank.PRIVATE;

        set({
          user: {
            ...currentUser,
            score: newScore,
            rank: newRank
          }
        });
      },

      completeLesson: (lessonId) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const completed = new Set(currentUser.completedLessons);
        completed.add(lessonId);

        set({
          user: {
            ...currentUser,
            completedLessons: Array.from(completed)
          }
        });
      },

      unlockNextLesson: () => {
        const lessons = get().lessons;
        const currentUser = get().user;
        if (!currentUser) return;

        const nextId = currentUser.unlockedLessonId + 1;
        const updatedLessons = lessons.map(l => 
          l.id === nextId ? { ...l, isLocked: false } : l
        );

        set({
          lessons: updatedLessons,
          user: {
            ...currentUser,
            unlockedLessonId: nextId
          }
        });
      },

      setView: (view) => set({ view }),
    }),
    {
      name: 'kho-20-storage',
    }
  )
);
