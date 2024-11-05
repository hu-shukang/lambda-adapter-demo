import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StoreStore {
  redirect: string | undefined | null;
  setRedirect: (redirect: string | undefined | null) => void;
}

export const useGlobalStore = create<StoreStore>()(
  persist(
    (set) => ({
      redirect: undefined,
      setRedirect: (redirect) => set({ redirect }),
    }),
    {
      name: 'global',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
