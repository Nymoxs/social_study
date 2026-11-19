import { createContext } from "react";

export interface FilterState {
  carrera: string;
  semestre: number | null;
  materia: string;
  tema: string;
  setCarrera: (value: string) => void;
  setSemestre: (value: number | null) => void;
  setMateria: (value: string) => void;
  setTema: (value: string) => void;
  clearFilters: () => void;
  semestres: number[];
  materias: string[];
  temas: string[];
  hasFilters: boolean;
}

export const FilterContext = createContext<FilterState | null>(null);
