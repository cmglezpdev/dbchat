import { create } from 'zustand'

type Store = {
  model: string;
  database: string;
  styles?: string | null;
  apiKey?: string | null;

  setModel: (model: string) => void;
  setApiKey: (apiKey: string) => void;
  setDatabase: (name: string) => void;
  setStyles: (styles: string) => void;
}

export const useConfigStore = create<Store>((set) => ({
  model: 'gpt-4o-mini',
  database: 'postgresql',
  apiKey: null,
  styles: null,

  setModel: (model: string) => set((state) => ({ ...state, model })),
  setApiKey: (apiKey: string) => set((state) => ({ ...state, apiKey })),
  setDatabase: (database: string) => set((state) => ({ ...state, database })),
  setStyles: (styles: string) => set((state) => ({ ...state, styles }))
}))
