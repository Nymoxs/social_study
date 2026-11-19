import { useMemo, useState, type ReactNode } from "react";
import { academicCatalog } from "../data/academicCatalog";
import { FilterContext, type FilterState } from "./FilterContextValue";

export function FilterProvider({ children }: { children: ReactNode }) {
  const [carrera, setCarreraState] = useState("");
  const [semestre, setSemestreState] = useState<number | null>(null);
  const [materia, setMateriaState] = useState("");
  const [tema, setTemaState] = useState("");

  const careerData = useMemo(() => academicCatalog.find(item => item.nombre === carrera), [carrera]);
  const semesterData = useMemo(() => careerData?.semestres.find(item => item.numero === semestre), [careerData, semestre]);
  const subjectData = useMemo(() => semesterData?.materias.find(item => item.nombre === materia), [semesterData, materia]);

  const value: FilterState = {
    carrera,
    semestre,
    materia,
    tema,
    setCarrera: value => { setCarreraState(value); setSemestreState(null); setMateriaState(""); setTemaState(""); },
    setSemestre: value => { setSemestreState(value); setMateriaState(""); setTemaState(""); },
    setMateria: value => { setMateriaState(value); setTemaState(""); },
    setTema: setTemaState,
    clearFilters: () => { setCarreraState(""); setSemestreState(null); setMateriaState(""); setTemaState(""); },
    semestres: careerData?.semestres.map(item => item.numero) ?? [],
    materias: semesterData?.materias.map(item => item.nombre) ?? [],
    temas: subjectData?.temas ?? [],
    hasFilters: Boolean(carrera || semestre || materia || tema),
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
