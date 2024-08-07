import { ITranduction, WebContentEN, WebContentES } from '@/lib/lang'
import { create } from 'zustand'

type Store = {
  lang: string;
  data: ITranduction;

  setLang: (lang: string) => void;
}

export const useLang = create<Store>((set) => ({
  lang: 'en',
  data: WebContentEN,

  setLang: (lang: string) => set((state) => {
    let data = {} as ITranduction

    switch (lang) {
      case 'en':
        data = WebContentEN
        break
      case 'es':
        data = WebContentES
        break
      default:
        throw new Error(`Invalid language. (${lang})`)
    }

    return {
      ...state,
      lang,
      data
    }
  })
}))
