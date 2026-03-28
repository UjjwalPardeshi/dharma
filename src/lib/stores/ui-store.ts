import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  crisisModalOpen: boolean;
  upgradeModalOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCrisisModalOpen: (open: boolean) => void;
  setUpgradeModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  crisisModalOpen: false,
  upgradeModalOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCrisisModalOpen: (open) => set({ crisisModalOpen: open }),
  setUpgradeModalOpen: (open) => set({ upgradeModalOpen: open }),
}));
