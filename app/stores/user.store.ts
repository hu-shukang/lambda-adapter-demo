import { create } from 'zustand';

// 定义状态类型
interface StoreState {
  username: string | undefined;
  setUsername: (username: string) => void;
  clearUser: () => void;
}

// 创建 Zustand store
export const useUserStore = create<StoreState>((set) => ({
  username: undefined,
  setUsername: (username) => set({ username }),
  clearUser: () => set({ username: undefined }),
}));
