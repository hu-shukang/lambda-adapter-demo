import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 定义状态类型
interface StoreState {
  username: string | undefined;
  payload: CognitoIdTokenPayload | undefined;
  setUsername: (username: string | undefined) => void;
  setPayload: (payload: CognitoIdTokenPayload | undefined) => void;
  clearUser: () => void;
}

// 创建 Zustand store
export const useUserStore = create<StoreState>()(
  persist(
    (set) => ({
      username: undefined,
      payload: undefined,
      setUsername: (username) => set({ username }),
      setPayload: (payload) => set({ payload }),
      clearUser: () => set({ username: undefined, payload: undefined }),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
