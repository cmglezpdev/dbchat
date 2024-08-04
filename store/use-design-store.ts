import { DbDesign } from '@/types'
import { create } from 'zustand'

type Store = {
  jsonDesign: DbDesign | null;
  sqlDesign: string | null;

  setJsonDesign: (jsonDesign: DbDesign) => void;
  setSqlDesign: (sqlDesign: string) => void;
}

export const useDesignStore = create<Store>((set) => ({
  jsonDesign: null,
  sqlDesign: null,

  setJsonDesign: (jsonDesign: DbDesign) => set((state) => ({ ...state, jsonDesign })),
  setSqlDesign: (sqlDesign: string) => set((state) => ({ ...state, sqlDesign }))
}))
