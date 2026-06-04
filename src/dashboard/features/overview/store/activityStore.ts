import type { ActivityItem } from '@shared/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface ActivityState {
  activities: ActivityItem[];
  addActivity: (item: ActivityItem) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>()(
  immer((set) => ({
    activities: [],
    addActivity: (item) =>
      set((state) => {
        // Prepend new activity, keep max 20 items
        state.activities.unshift(item);
        if (state.activities.length > 20) {
          state.activities.pop();
        }
      }),
    clearActivities: () =>
      set((state) => {
        state.activities = [];
      }),
  })),
);
