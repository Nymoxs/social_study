import { useContext } from "react";
import { FilterContext } from "./FilterContextValue";

export function useAcademicFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useAcademicFilters debe usarse dentro de FilterProvider");
  return context;
}
