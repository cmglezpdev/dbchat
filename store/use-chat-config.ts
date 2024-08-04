import { create } from 'zustand'

type Store = {
  model: string;
  apiKey?: string | null;

  setModel: (model: string) => void;
  setApiKey: (apiKey: string) => void;
}

export const useConfigStore = create<Store>((set) => ({
  model: 'gpt4o-mini',
  apiKey: null,

  setModel: (model: string) => set((state) => ({ ...state, model })),
  setApiKey: (apiKey: string) => set((state) => ({ ...state, apiKey }))
}))
