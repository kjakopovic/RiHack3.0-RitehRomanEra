import { create } from "zustand";

interface EventState {
  joinedEvents: string[];
  joinEvent: (id: string) => void;
  unjoinEvent: (id: string) => void;
}

export const useEventStore = create<EventState>((set) => ({
  joinedEvents: [],
  joinEvent: (id: string) =>
    set((state) => ({
      joinedEvents: [...state.joinedEvents, id],
    })),
  unjoinEvent: (id: string) =>
    set((state) => ({
      joinedEvents: state.joinedEvents.filter((eventId) => eventId !== id),
    })),
}));
