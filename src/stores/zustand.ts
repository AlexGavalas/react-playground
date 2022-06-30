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
