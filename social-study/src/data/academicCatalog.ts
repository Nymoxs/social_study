export interface AcademicTopic {
  nombre: string;
}

export interface AcademicMateria {
  nombre: string;
  temas: string[];
}

export interface AcademicSemester {
  numero: number;
  materias: AcademicMateria[];
}

export interface AcademicCareer {
  id: string;
  nombre: string;
  semestres: AcademicSemester[];
}

export interface LiveSpace {
  id: string;
  titulo: string;
  anfitrion: string;
  materia: string;
  carrera: string;
  conectados: number;
}

const temasGenerales = ["Fundamentos", "Conceptos centrales", "Aplicaciones", "Práctica y proyecto"];

export const academicCatalog: AcademicCareer[] = [
  {
    id: "sistemas",
    nombre: "Ingeniería en Sistemas Computacionales",
    semestres: [
      { numero: 1, materias: [
        { nombre: "Cálculo Diferencial", temas: ["Números reales", "Funciones", "Límites y continuidad", "Derivadas", "Aplicaciones de la derivada"] },
        { nombre: "Fundamentos de Programación", temas: temasGenerales },
        { nombre: "Matemáticas Discretas", temas: temasGenerales },
        { nombre: "Fundamentos de Investigación", temas: temasGenerales },
        { nombre: "Taller de Ética", temas: temasGenerales },
        { nombre: "Taller de Administración", temas: temasGenerales }
      ] },
      { numero: 2, materias: [
        { nombre: "Cálculo Integral", temas: temasGenerales },
        { nombre: "Programación Orientada a Objetos", temas: temasGenerales },
        { nombre: "Química", temas: temasGenerales },
        { nombre: "Álgebra Lineal", temas: temasGenerales },
        { nombre: "Probabilidad y Estadística", temas: temasGenerales },
        { nombre: "Contabilidad Financiera", temas: temasGenerales }
      ] },
      { numero: 3, materias: [
        { nombre: "Cálculo Vectorial", temas: temasGenerales },
        { nombre: "Estructura de Datos", temas: ["Introducción a las estructuras de datos", "Recursividad", "Estructuras lineales", "Estructuras no lineales", "Métodos de ordenamiento", "Métodos de búsqueda"] },
        { nombre: "Cultura Empresarial", temas: temasGenerales },
        { nombre: "Investigación de Operaciones", temas: temasGenerales },
        { nombre: "Desarrollo Sustentable", temas: temasGenerales },
        { nombre: "Física General", temas: temasGenerales }
      ] },
      { numero: 4, materias: [
        { nombre: "Ecuaciones Diferenciales", temas: temasGenerales },
        { nombre: "Métodos Numéricos", temas: temasGenerales },
        { nombre: "Tópicos Avanzados de Programación", temas: temasGenerales },
        { nombre: "Fundamentos de Base de Datos", temas: ["Introducción a las bases de datos", "Diseño con el modelo E-R", "Modelo relacional", "Normalización", "Álgebra relacional", "Lenguaje SQL"] },
        { nombre: "Simulación", temas: temasGenerales },
        { nombre: "Principios Eléctricos y Aplicaciones Digitales", temas: temasGenerales }
      ] },
      { numero: 5, materias: [
        { nombre: "Graficación", temas: temasGenerales },
        { nombre: "Fundamentos de Telecomunicaciones", temas: temasGenerales },
        { nombre: "Sistemas Operativos I", temas: temasGenerales },
        { nombre: "Taller de Base de Datos", temas: temasGenerales },
        { nombre: "Fundamentos de Ingeniería de Software", temas: temasGenerales },
        { nombre: "Arquitectura de Computadoras", temas: temasGenerales }
      ] },
      { numero: 6, materias: [
        { nombre: "Lenguajes y Autómatas I", temas: temasGenerales },
        { nombre: "Redes de Computadoras", temas: temasGenerales },
        { nombre: "Taller de Sistemas Operativos", temas: temasGenerales },
        { nombre: "Administración de Base de Datos", temas: temasGenerales },
        { nombre: "Ingeniería de Software", temas: temasGenerales },
        { nombre: "Lenguajes de Interfaz", temas: temasGenerales }
      ] },
      { numero: 7, materias: [
        { nombre: "Lenguajes y Autómatas II", temas: temasGenerales },
        { nombre: "Conmutación y Enrutamiento en Redes de Datos", temas: temasGenerales },
        { nombre: "Taller de Investigación I", temas: temasGenerales },
        { nombre: "Gestión de Proyectos de Software", temas: temasGenerales },
        { nombre: "Sistemas Programables", temas: temasGenerales },
        { nombre: "Especialidad", temas: ["Fundamentos", "Aplicación práctica", "Proyecto integrador"] }
      ] },
      { numero: 8, materias: [
        { nombre: "Programación Lógica y Funcional", temas: temasGenerales },
        { nombre: "Administración de Redes", temas: temasGenerales },
        { nombre: "Taller de Investigación II", temas: temasGenerales },
        { nombre: "Programación Web", temas: ["HTML y CSS", "JavaScript", "Arquitectura web", "Framework frontend", "Desarrollo de aplicaciones"] },
        { nombre: "Especialidad", temas: ["Fundamentos", "Aplicación práctica", "Proyecto integrador"] }
      ] },
      { numero: 9, materias: [
        { nombre: "Inteligencia Artificial", temas: temasGenerales },
        { nombre: "Residencia Profesional", temas: ["Planeación", "Desarrollo", "Entrega", "Documentación"] }
      ] }
    ]
  }
];

export const liveSpaces: LiveSpace[] = [
  { id: "live-1", titulo: "Repaso Express de SQL", anfitrion: "Valeria Torres", materia: "Fundamentos de Base de Datos", carrera: "Ingeniería en Sistemas Computacionales", conectados: 38 },
  { id: "live-2", titulo: "Estructuras lineales y recursividad", anfitrion: "Andrés Flores", materia: "Estructura de Datos", carrera: "Ingeniería en Sistemas Computacionales", conectados: 24 },
  { id: "live-3", titulo: "Derivadas antes del examen", anfitrion: "Luis Martínez", materia: "Cálculo Diferencial", carrera: "Ingeniería en Sistemas Computacionales", conectados: 17 }
];
