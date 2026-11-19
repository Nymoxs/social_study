import type { User, Post } from "../types";

export const mockUsers: User[] = [
  {
    id: "u1", nombre: "Ana López", usuario: "ana_sistemas",
    email: "ana@socialstudy.com", password: "123456",
    carrera: "Sistemas Computacionales", foto: "https://i.pravatar.cc/150?img=47",
    portada: "", bio: "Apasionada por la programación.",
    habilidades: ["Python", "Java", "Bases de datos"],
    puntos: 180, racha: 5, ultimaPublicacion: "2026-11-18",
    esPro: false, seguidores: ["u2", "u3"], seguidos: ["u2", "u4"]
  },
  {
    id: "u2", nombre: "Luis Martínez", usuario: "luis_industrial",
    email: "luis@socialstudy.com", password: "123456",
    carrera: "Ingeniería Industrial", foto: "https://i.pravatar.cc/150?img=12",
    portada: "", bio: "Me gusta aprender y compartir.",
    habilidades: ["Estadística", "Calidad"],
    puntos: 150, racha: 3, ultimaPublicacion: "2026-11-17",
    esPro: false, seguidores: ["u1"], seguidos: ["u1", "u3"]
  },
  {
    id: "u3", nombre: "María García", usuario: "maria_admin",
    email: "maria@socialstudy.com", password: "123456",
    carrera: "Administración", foto: "https://i.pravatar.cc/150?img=44",
    portada: "", bio: "Compartiendo conocimientos.",
    habilidades: ["Finanzas", "Marketing"],
    puntos: 220, racha: 8, ultimaPublicacion: "2026-11-18",
    esPro: true, seguidores: ["u1", "u2"], seguidos: ["u1"]
  },
  {
    id: "u4", nombre: "Carlos Pérez", usuario: "carlos_electronica",
    email: "carlos@socialstudy.com", password: "123456",
    carrera: "Electrónica", foto: "https://i.pravatar.cc/150?img=13",
    portada: "", bio: "Electrónica y tecnología.",
    habilidades: ["Arduino", "Circuitos"],
    puntos: 95, racha: 2, ultimaPublicacion: "2026-11-18",
    esPro: false, seguidores: ["u1"], seguidos: ["u5"]
  },
  {
    id: "u5", nombre: "Sofía Hernández", usuario: "sofia_mecatronica",
    email: "sofia@socialstudy.com", password: "123456",
    carrera: "Mecatrónica", foto: "https://i.pravatar.cc/150?img=45",
    portada: "", bio: "Robótica y automatización.",
    habilidades: ["Robótica", "C++"],
    puntos: 130, racha: 4, ultimaPublicacion: "2026-11-17",
    esPro: false, seguidores: ["u4"], seguidos: ["u6"]
  },
  {
    id: "u6", nombre: "Diego Ramírez", usuario: "diego_civil",
    email: "diego@socialstudy.com", password: "123456",
    carrera: "Ingeniería Civil", foto: "https://i.pravatar.cc/150?img=14",
    portada: "", bio: "Construyendo conocimiento.",
    habilidades: ["Matemáticas", "Física"],
    puntos: 80, racha: 1, ultimaPublicacion: "2026-11-18",
    esPro: false, seguidores: ["u5"], seguidos: []
  },
  {
    id: "u7", nombre: "Valeria Torres", usuario: "vale_gestion",
    email: "vale@socialstudy.com", password: "123456",
    carrera: "Gestión Empresarial", foto: "https://i.pravatar.cc/150?img=48",
    portada: "", bio: "Ideas para emprender.",
    habilidades: ["Emprendimiento", "Finanzas"],
    puntos: 110, racha: 6, ultimaPublicacion: "2026-11-18",
    esPro: false, seguidores: [], seguidos: ["u3"]
  },
  {
    id: "u8", nombre: "Andrés Flores", usuario: "andres_sistemas",
    email: "andres@socialstudy.com", password: "123456",
    carrera: "Sistemas Computacionales", foto: "https://i.pravatar.cc/150?img=15",
    portada: "", bio: "Desarrollador en formación.",
    habilidades: ["JavaScript", "React"],
    puntos: 170, racha: 7, ultimaPublicacion: "2026-11-18",
    esPro: false, seguidores: ["u9"], seguidos: ["u1"]
  },
  {
    id: "u9", nombre: "Fernanda Cruz", usuario: "fer_quimica",
    email: "fer@socialstudy.com", password: "123456",
    carrera: "Ingeniería Química", foto: "https://i.pravatar.cc/150?img=49",
    portada: "", bio: "Ciencia para todos.",
    habilidades: ["Química", "Laboratorio"],
    puntos: 75, racha: 2, ultimaPublicacion: "2026-11-17",
    esPro: false, seguidores: ["u8"], seguidos: []
  },
  {
    id: "u10", nombre: "Roberto Díaz", usuario: "roberto_meca",
    email: "roberto@socialstudy.com", password: "123456",
    carrera: "Mecánica", foto: "https://i.pravatar.cc/150?img=16",
    portada: "", bio: "Aprendiendo cada día.",
    habilidades: ["CAD", "Mecánica"],
    puntos: 60, racha: 1, ultimaPublicacion: "2026-11-16",
    esPro: false, seguidores: [], seguidos: ["u4"]
  },
  {
    id: "u11", nombre: "Daniela Reyes", usuario: "dani_sistemas",
    email: "dani@socialstudy.com", password: "123456",
    carrera: "Sistemas Computacionales", foto: "https://i.pravatar.cc/150?img=50",
    portada: "", bio: "Compartiendo apuntes.",
    habilidades: ["Python", "SQL"],
    puntos: 140, racha: 4, ultimaPublicacion: "2026-11-18",
    esPro: false, seguidores: ["u12"], seguidos: ["u8"]
  },
  {
    id: "u12", nombre: "Miguel Sánchez", usuario: "miguel_electrica",
    email: "miguel@socialstudy.com", password: "123456",
    carrera: "Ingeniería Eléctrica", foto: "https://i.pravatar.cc/150?img=17",
    portada: "", bio: "Energía y conocimiento.",
    habilidades: ["Electricidad", "Física"],
    puntos: 90, racha: 3, ultimaPublicacion: "2026-11-17",
    esPro: false, seguidores: ["u11"], seguidos: []
  }
];

export const mockPosts: Post[] = [
  {
    id: "p1", autor: "u1", carrera: "Sistemas Computacionales",
    materia: "Programación", tipo: "Resumen",
    titulo: "Introducción a Python",
    descripcion: "Resumen de variables, condicionales y ciclos.",
    linkArchivo: "https://docs.google.com/",
    likes: ["u2", "u3"], guardados: ["u2"],
    gracias: ["u3"], votosEncuesta: [],
    comentarios: [], reportes: [], fecha: "2026-11-18"
  },
  {
    id: "p2", autor: "u2", carrera: "Ingeniería Industrial",
    materia: "Estadística", tipo: "PDF",
    titulo: "Distribuciones de probabilidad",
    descripcion: "Material para estudiar distribuciones.",
    linkArchivo: "https://example.com/estadistica.pdf",
    likes: ["u1"], guardados: ["u3"],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-17"
  },
  {
    id: "p3", autor: "u3", carrera: "Administración",
    materia: "Finanzas", tipo: "Guia",
    titulo: "Guía de estados financieros",
    descripcion: "Conceptos básicos y ejemplos.",
    linkArchivo: "https://example.com/finanzas",
    likes: ["u1", "u2"], guardados: [],
    gracias: ["u1"], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-16"
  },
  {
    id: "p4", autor: "u4", carrera: "Electrónica",
    materia: "Circuitos", tipo: "Resumen",
    titulo: "Leyes de Kirchhoff",
    descripcion: "Explicación de las leyes de corriente y voltaje.",
    linkArchivo: "https://example.com/kirchhoff",
    likes: ["u5"], guardados: ["u5"],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-18"
  },
  {
    id: "p5", autor: "u5", carrera: "Mecatrónica",
    materia: "Robótica", tipo: "Encuesta",
    titulo: "¿Qué lenguaje prefieres para robótica?",
    descripcion: "Comparte tu opinión.",
    linkArchivo: "",
    likes: ["u4"], guardados: [],
    gracias: [], votosEncuesta: [
      { id: "o1", texto: "Python", votos: ["u1", "u2", "u4"] },
      { id: "o2", texto: "C++", votos: ["u5", "u6"] }
    ],
    comentarios: [], reportes: [], fecha: "2026-11-18"
  },
  {
    id: "p6", autor: "u6", carrera: "Ingeniería Civil",
    materia: "Matemáticas", tipo: "Guia",
    titulo: "Derivadas básicas",
    descripcion: "Reglas y ejercicios resueltos.",
    linkArchivo: "https://example.com/derivadas",
    likes: ["u1"], guardados: [],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-17"
  },
  {
    id: "p7", autor: "u7", carrera: "Gestión Empresarial",
    materia: "Emprendimiento", tipo: "Resumen",
    titulo: "Modelo Canvas",
    descripcion: "Los nueve bloques del modelo de negocio.",
    linkArchivo: "https://example.com/canvas",
    likes: ["u3"], guardados: ["u3"],
    gracias: ["u3"], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-18"
  },
  {
    id: "p8", autor: "u8", carrera: "Sistemas Computacionales",
    materia: "Desarrollo web", tipo: "Guia",
    titulo: "Primeros pasos con React",
    descripcion: "Componentes, props y estado.",
    linkArchivo: "https://react.dev/",
    likes: ["u1", "u11"], guardados: ["u1"],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-18"
  },
  {
    id: "p9", autor: "u9", carrera: "Ingeniería Química",
    materia: "Química", tipo: "PDF",
    titulo: "Tabla periódica",
    descripcion: "Guía de elementos químicos.",
    linkArchivo: "https://example.com/tabla.pdf",
    likes: ["u8"], guardados: [],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-17"
  },
  {
    id: "p10", autor: "u10", carrera: "Mecánica",
    materia: "Diseño", tipo: "Resumen",
    titulo: "Introducción a CAD",
    descripcion: "Conceptos básicos de diseño asistido.",
    linkArchivo: "https://example.com/cad",
    likes: ["u4"], guardados: [],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-16"
  },
  {
    id: "p11", autor: "u11", carrera: "Sistemas Computacionales",
    materia: "Bases de datos", tipo: "Guia",
    titulo: "Consultas SQL básicas",
    descripcion: "SELECT, WHERE, ORDER BY y JOIN.",
    linkArchivo: "https://example.com/sql",
    likes: ["u1", "u8"], guardados: ["u8"],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-18"
  },
  {
    id: "p12", autor: "u12", carrera: "Ingeniería Eléctrica",
    materia: "Electricidad", tipo: "Resumen",
    titulo: "Ley de Ohm",
    descripcion: "Relación entre voltaje, corriente y resistencia.",
    linkArchivo: "https://example.com/ohm",
    likes: ["u4"], guardados: [],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-17"
  },
  {
    id: "p13", autor: "u1", carrera: "Sistemas Computacionales",
    materia: "Matemáticas", tipo: "Encuesta",
    titulo: "¿Qué tema de cálculo es más difícil?",
    descripcion: "Queremos conocer tu opinión.",
    linkArchivo: "",
    likes: [], guardados: [], gracias: [],
    votosEncuesta: [
      { id: "o3", texto: "Límites", votos: ["u2"] },
      { id: "o4", texto: "Derivadas", votos: ["u3", "u8"] },
      { id: "o5", texto: "Integrales", votos: ["u11"] }
    ],
    comentarios: [], reportes: [], fecha: "2026-11-18"
  },
  {
    id: "p14", autor: "u3", carrera: "Administración",
    materia: "Marketing", tipo: "PDF",
    titulo: "Fundamentos de marketing",
    descripcion: "Apuntes propios para estudiar.",
    linkArchivo: "https://example.com/marketing",
    likes: ["u7"], guardados: ["u7"],
    gracias: [], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-17"
  },
  {
    id: "p15", autor: "u8", carrera: "Sistemas Computacionales",
    materia: "Programación", tipo: "Resumen",
    titulo: "JavaScript: funciones y arreglos",
    descripcion: "Ejemplos prácticos para principiantes.",
    linkArchivo: "https://example.com/javascript",
    likes: ["u1", "u11"], guardados: ["u1", "u11"],
    gracias: ["u1"], votosEncuesta: [], comentarios: [], reportes: [],
    fecha: "2026-11-18"
  },
  {
    id: "p16", autor: "u11", carrera: "Ingeniería en Sistemas Computacionales", semestre: 1,
    materia: "Cálculo Diferencial", tema: "Derivadas",
    tipo: "PDF", titulo: "Derivadas: guía rápida de ejercicios",
    descripcion: "Ejemplos resueltos de derivadas, reglas de derivación y aplicaciones básicas.",
    linkArchivo: "", adjuntoNombre: "derivadas-guia.pdf",
    likes: ["u1", "u8"], guardados: ["u1"], gracias: ["u8"],
    votosEncuesta: [], comentarios: [], reportes: [], fecha: "2026-11-18"
  },
  {
    id: "p17", autor: "u8", carrera: "Ingeniería en Sistemas Computacionales", semestre: 3,
    materia: "Estructura de Datos", tema: "Estructuras lineales",
    tipo: "Resumen", titulo: "Pilas, colas y listas enlazadas",
    descripcion: "Resumen visual de operaciones, representación en memoria y casos de aplicación.",
    linkArchivo: "", likes: ["u1", "u11"], guardados: [], gracias: ["u11"],
    votosEncuesta: [], comentarios: [], reportes: [], fecha: "2026-11-18"
  },
  {
    id: "p18", autor: "u3", carrera: "Ingeniería en Sistemas Computacionales", semestre: 4,
    materia: "Fundamentos de Base de Datos", tema: "Normalización",
    tipo: "PDF", titulo: "Normalización de bases de datos",
    descripcion: "Primera, segunda y tercera forma normal con ejercicios paso a paso.",
    linkArchivo: "", adjuntoNombre: "normalizacion-bases-datos.pdf",
    likes: ["u6", "u9"], guardados: ["u9"], gracias: [], votosEncuesta: [],
    comentarios: [], reportes: [], fecha: "2026-11-17"
  },
  {
    id: "p19", autor: "u2", carrera: "Ingeniería en Sistemas Computacionales", semestre: 8,
    materia: "Programación Web", tema: "JavaScript",
    tipo: "Resumen", titulo: "JavaScript moderno para la web",
    descripcion: "Conceptos esenciales de JavaScript: funciones, arreglos, eventos y módulos.",
    linkArchivo: "", likes: ["u3", "u7"], guardados: ["u7"], gracias: ["u7"],
    votosEncuesta: [], comentarios: [], reportes: [], fecha: "2026-11-18"
  },
  {
    id: "p20", autor: "u7", carrera: "Ingeniería en Sistemas Computacionales", semestre: 9,
    materia: "Inteligencia Artificial", tema: "Fundamentos",
    tipo: "Guia", titulo: "Introducción a la inteligencia artificial",
    descripcion: "Mapa de conceptos básicos, agentes inteligentes y principales áreas de aplicación.",
    linkArchivo: "", adjuntoNombre: "introduccion-ia.pdf",
    likes: ["u3"], guardados: ["u3"], gracias: ["u3"], votosEncuesta: [],
    comentarios: [], reportes: [], fecha: "2026-11-18"
  }
];
