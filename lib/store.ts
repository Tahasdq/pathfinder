import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StrategyResult } from '@/components/ResultsDashboard';

interface AppState {
  strategyResult: StrategyResult | null;
  completedRoadmapTasks: string[];
  isSignInModalOpen: boolean;
  setStrategyResult: (result: StrategyResult | null) => void;
  toggleRoadmapTask: (taskId: string) => void;
  clearResult: () => void;
  setSignInModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      strategyResult: null,
      completedRoadmapTasks: [],
      isSignInModalOpen: false,
      setStrategyResult: (result) => set({ strategyResult: result, completedRoadmapTasks: [] }),
      toggleRoadmapTask: (taskId) => set((state) => ({
        completedRoadmapTasks: state.completedRoadmapTasks.includes(taskId)
          ? state.completedRoadmapTasks.filter(id => id !== taskId)
          : [...state.completedRoadmapTasks, taskId]
      })),
      clearResult: () => set({ strategyResult: null, completedRoadmapTasks: [] }),
      setSignInModalOpen: (open) => set({ isSignInModalOpen: open }),
    }),
    {
      name: 'pathfinder-storage',
    }
  )
);
