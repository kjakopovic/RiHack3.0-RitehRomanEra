// store/filter-store.ts

import { create } from "zustand";

interface FilterState {
  selectedGenres: string[];
  selectedTypes: string[];
  selectedThemes: string[];
  selectedDate: string | null;
  setSelectedGenres: (genres: string[]) => void;
  setSelectedTypes: (types: string[]) => void;
  setSelectedThemes: (themes: string[]) => void;
  setSelectedDate: (date: string | null) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedGenres: [],
  selectedTypes: [],
  selectedThemes: [],
  selectedDate: null,
  setSelectedGenres: (genres) => set({ selectedGenres: genres }),
  setSelectedTypes: (types) => set({ selectedTypes: types }),
  setSelectedThemes: (themes) => set({ selectedThemes: themes }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  clearFilters: () =>
    set({
      selectedGenres: [],
      selectedTypes: [],
      selectedThemes: [],
      selectedDate: null,
    }),
}));
