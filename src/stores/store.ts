// import { atom } from 'jotai';

// export const notificationAtom = atom('');

// export const optionsAtom = atom({
//     optionA: 'A',
//     optionB: 'B',
// });

// export const optionsAtomA = atom((get) => get(optionsAtom).optionA);
// export const optionsAtomB = atom((get) => get(optionsAtom).optionB);
// export const optionsAtomS = atom((get) => {
//     const { optionA, optionB } = get(optionsAtom);
//     return `${optionA} ${optionB}`;
// });

import create from 'zustand';

interface Store {
    optionA: string;
    optionB: string;
    setOptionsA: (str: string) => void;
    setOptionsB: (str: string) => void;
}

export const useStore = create<Store>((set) => ({
    optionA: '',
    optionB: 'BBB',
    setOptionsA: (str) => set(({ optionA }) => ({ optionA: str + optionA })),
    setOptionsB: (str) => set({ optionB: str }),
}));
