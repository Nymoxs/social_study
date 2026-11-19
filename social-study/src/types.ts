export interface User {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  password: string;
  carrera: string;
  foto: string;
  portada: string;
  bio: string;
  habilidades: string[];
  puntos: number;
  racha: number;
  ultimaPublicacion: string | null;
  esPro: boolean;
  seguidores: string[];
  seguidos: string[];
}

export interface PollOption {
  id: string;
  texto: string;
  votos: string[];
}
export type ReactionType =
  | "meGusta"
  | "meAyudo"
  | "pocoUtil";

export interface Reactions {
  meGusta: string[];
  meAyudo: string[];
  pocoUtil: string[];
}

export interface Post {
  id: string;
  autor: string;
  carrera: string;
  semestre?: number;
  materia: string;
  tema?: string;
  tipo: "Resumen" | "PDF" | "Guia" | "Encuesta" | "Cápsula" | "Tu espacio" | "like" | "meAyudo" | "guardar" | "gracias";
  titulo: string;
  descripcion: string;
  linkArchivo: string;
  adjuntoNombre?: string;
  reacciones?: Reactions;
  likes?: string[];
  guardados: string[];
  gracias: string[];
  votosEncuesta: PollOption[];
  comentarios: string[];
  reportes: string[];
  fecha: string;
}

export interface Notification {
  id: string;
  usuarioDestino: string;
  usuarioOrigen: string;
  postId: string;
  tipo: "like" | "guardar" | "gracias";
  mensaje: string;
  leida: boolean;
  fecha: string;
}
