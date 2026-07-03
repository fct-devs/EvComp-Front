import { create } from 'zustand';

interface EventoState {
  evento: any | null;
  setEvento: (evento: any) => void;
}

export const useEventoStore = create<EventoState>((set) => ({
  evento: null,
  setEvento: (evento) => set({ evento }),
}));
