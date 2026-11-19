import { academicCatalog } from "../data/academicCatalog";
import { useAcademicFilters } from "./useAcademicFilters";

export default function FiltrosCascada() {
  const filters = useAcademicFilters();

  return (
    <section className="cascade-filter-bar" aria-label="Filtros académicos del feed">
      <label>
        <span>Carrera</span>
        <select value={filters.carrera} onChange={event => filters.setCarrera(event.target.value)}>
          <option value="">Todas las carreras</option>
          {academicCatalog.map(career => <option key={career.id} value={career.nombre}>{career.nombre}</option>)}
        </select>
      </label>

      <label>
        <span>Semestre</span>
        <select value={filters.semestre ?? ""} disabled={!filters.carrera} onChange={event => filters.setSemestre(event.target.value ? Number(event.target.value) : null)}>
          <option value="">Todos</option>
          {filters.semestres.map(semester => <option key={semester} value={semester}>Semestre {semester}</option>)}
        </select>
      </label>

      <label>
        <span>Materia</span>
        <select value={filters.materia} disabled={!filters.semestre} onChange={event => filters.setMateria(event.target.value)}>
          <option value="">Todas</option>
          {filters.materias.map(subject => <option key={subject} value={subject}>{subject}</option>)}
        </select>
      </label>

      <label>
        <span>Tema</span>
        <select value={filters.tema} disabled={!filters.materia} onChange={event => filters.setTema(event.target.value)}>
          <option value="">Todos</option>
          {filters.temas.map(topic => <option key={topic} value={topic}>{topic}</option>)}
        </select>
      </label>

      {filters.hasFilters && <button type="button" className="clear-filters-button" onClick={filters.clearFilters}>Limpiar</button>}
    </section>
  );
}
