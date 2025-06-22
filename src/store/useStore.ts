import { create } from 'zustand';

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

interface User {
  id: string;
  name: string;
  role: string;
}

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  user: { id: 'u1', name: 'John Doe', role: 'Admin' },
  setUser: (user) => set({ user }),
  notifications: [
    { id: 'n1', message: 'New message received', read: false },
    { id: 'n2', message: 'Your report is ready', read: true },
  ],
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
}));
