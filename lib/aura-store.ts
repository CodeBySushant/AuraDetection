import { create } from "zustand";

export const useAuraStore = create((set) => ({
  auraResult: null,
  loading: false,
  error: null,

  setAuraResult: (data: any) =>
    set({ auraResult: data, loading: false }),

  setLoading: () =>
    set({ loading: true, error: null }),

  setError: (err: any) =>
    set({ error: err, loading: false }),
}));