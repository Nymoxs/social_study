import type {
  User,
  Post,
  Notification,
  ReactionType
} from "../types";
import { mockUsers, mockPosts } from "../data/mockData";

// CLAVES DE ALMACENAMIENTO
const USERS_KEY = "socialStudy_users";
const POSTS_KEY = "socialStudy_posts";
const NOTIFICATIONS_KEY = "socialStudy_notifications";

// PUNTOS POR INTERACCIÓN
const POINTS = {
  LIKE: 5,
  SAVE: 10,
  THANKS: 15,
  POST: 20
};
const REACTION_POINTS: Record<ReactionType, number> = {
  meGusta: 5,
  meAyudo: 10,
  pocoUtil: 0
};

// INICIALIZAR DATOS
export function initializeStorage(): void {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }

  if (!localStorage.getItem(POSTS_KEY)) {
    const normalizedPosts = mockPosts.map(post => ({
      ...post,
      reacciones: post.reacciones ?? {
        meGusta: post.likes ?? [],
        meAyudo: post.gracias ?? [],
        pocoUtil: []
      }
    }));
    localStorage.setItem(POSTS_KEY, JSON.stringify(normalizedPosts));
  } else {
    const storedPosts = JSON.parse(localStorage.getItem(POSTS_KEY) || "[]") as Post[];
    let changed = false;
    const normalizedPosts = storedPosts.map(post => {
      if (post.reacciones) return post;
      changed = true;
      return {
        ...post,
        reacciones: {
          meGusta: post.likes ?? [],
          meAyudo: post.gracias ?? [],
          pocoUtil: []
        }
      };
    });
    if (changed) localStorage.setItem(POSTS_KEY, JSON.stringify(normalizedPosts));
  }

  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  }
}

// OBTENER DATOS
export function getUsers(): User[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

export function getPosts(): Post[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
}

export function getNotifications(): Notification[] {
  initializeStorage();
  return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
}

// GUARDAR DATOS
function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function savePosts(posts: Post[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function saveNotifications(notifications: Notification[]): void {
  localStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify(notifications)
  );
}

// OBTENER FECHA LOCAL
function getToday(): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// CREAR NOTIFICACIÓN
function createNotification(
  post: Post,
  actorId: string,
  tipo: Notification["tipo"]
): void {
  if (post.autor === actorId) return;

  const users = getUsers();
  const actor = users.find(user => user.id === actorId);

  if (!actor) return;

 const messages = {
  like: `${actor.nombre} dio Me gusta a tu publicación`,
  meAyudo: `${actor.nombre} indicó que tu material le ayudó`,
  guardar: `${actor.nombre} guardó tu publicación`,
  gracias: `${actor.nombre} te agradeció por tu material`
};

  const notifications = getNotifications();

  const notification: Notification = {
    id: crypto.randomUUID(),
    usuarioDestino: post.autor,
    usuarioOrigen: actorId,
    postId: post.id,
    tipo,
    mensaje: messages[tipo],
    leida: false,
    fecha: new Date().toISOString()
  };

  notifications.unshift(notification);
  saveNotifications(notifications);
}

// ACTUALIZAR PUNTOS
function updatePoints(userId: string, amount: number): void {
  const users = getUsers();

  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) return;

  users[userIndex].puntos = Math.max(
    0,
    users[userIndex].puntos + amount
  );

  saveUsers(users);
}

// DAR O QUITAR LIKE
export function toggleReaction(
  postId: string,
  userId: string,
  reaction: ReactionType
): Post[] {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);

  if (!post) return posts;

  // Impedir reaccionar a tu propia publicación
  if (post.autor === userId) return posts;

  // Comprobar que el usuario exista
  if (!getUsers().some(u => u.id === userId)) return posts;

  if (!post.reacciones) {
    post.reacciones = {
      meGusta: post.likes ?? [],
      meAyudo: post.gracias ?? [],
      pocoUtil: []
    };
  }

  const previous = (
    Object.keys(post.reacciones) as ReactionType[]
  ).find(type => post.reacciones?.[type].includes(userId));

  // Quitar reacción anterior y sus puntos
  if (previous) {
    post.reacciones[previous] =
      post.reacciones[previous].filter(id => id !== userId);

    updatePoints(post.autor, -REACTION_POINTS[previous]);
  }

  // Pulsar la misma reacción significa quitarla
  if (previous !== reaction) {
    post.reacciones[reaction].push(userId);

    updatePoints(post.autor, REACTION_POINTS[reaction]);

    if (reaction === "meGusta") {
      createNotification(post, userId, "like");
    }
  }

  savePosts(posts);
  return posts;
}

// GUARDAR O QUITAR DE FAVORITOS
export function toggleSave(
  postId: string,
  userId: string
): Post[] {
  const posts = getPosts();

  const post = posts.find(item => item.id === postId);

  if (!post) return posts;

  const alreadySaved = post.guardados.includes(userId);

  if (alreadySaved) {
    post.guardados = post.guardados.filter(id => id !== userId);
    updatePoints(post.autor, -POINTS.SAVE);
  } else {
    post.guardados.push(userId);
    updatePoints(post.autor, POINTS.SAVE);
    createNotification(post, userId, "guardar");
  }

  savePosts(posts);
  return posts;
}

// DAR GRACIAS
export function giveThanks(
  postId: string,
  userId: string
): Post[] {
  const posts = getPosts();

  const post = posts.find(item => item.id === postId);

  if (!post) return posts;

  if (post.gracias.includes(userId)) {
    return posts;
  }

  post.gracias.push(userId);

  updatePoints(post.autor, POINTS.THANKS);
  createNotification(post, userId, "gracias");

  savePosts(posts);
  return posts;
}

// PUBLICAR CONTENIDO
type NewPost = Omit<
  Post,
  | "id"
  | "reacciones"
  | "guardados"
  | "gracias"
  | "comentarios"
  | "reportes"
  | "fecha"
>;

export function savePost(postData: NewPost): Post[] {
  const posts = getPosts();     

  const newPost: Post = {
    ...postData,
    id: crypto.randomUUID(),
    reacciones: {
    meGusta: [],
    meAyudo: [],
    pocoUtil: []
    },
    guardados: [],
    gracias: [],
    comentarios: [],
    reportes: [],
    fecha: getToday()
  };

  posts.unshift(newPost);
  savePosts(posts);

  updatePoints(postData.autor, POINTS.POST);
  calculateStreak(postData.autor);

  return posts;
}

// CALCULAR RACHA
export function calculateStreak(userId: string): number {
  const users = getUsers();

  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex === -1) return 0;

  const user = users[userIndex];
  const today = getToday();
  const lastDate = user.ultimaPublicacion;

  if (lastDate !== today) {
    if (!lastDate) {
      user.racha = 1;
    } else {
      const previous = new Date(`${lastDate}T00:00:00`);
      const current = new Date(`${today}T00:00:00`);

      const difference = Math.round(
        (current.getTime() - previous.getTime()) /
        (1000 * 60 * 60 * 24)
      );

      user.racha = difference === 1 ? user.racha + 1 : 1;
    }

    user.ultimaPublicacion = today;
    saveUsers(users);
  }

  return user.racha;
}

// CONSULTAR PUNTOS
export function calculatePoints(userId: string): number {
  const user = getUsers().find(item => item.id === userId);
  return user ? user.puntos : 0;
}

// SEGUIR O DEJAR DE SEGUIR
export function toggleFollow(
  currentUserId: string,
  targetUserId: string
): User[] {
  if (currentUserId === targetUserId) return getUsers();

  const users = getUsers();

  const currentUser = users.find(user => user.id === currentUserId);
  const targetUser = users.find(user => user.id === targetUserId);

  if (!currentUser || !targetUser) return users;

  const alreadyFollowing = currentUser.seguidos.includes(targetUserId);

  if (alreadyFollowing) {
    currentUser.seguidos = currentUser.seguidos.filter(
      id => id !== targetUserId
    );

    targetUser.seguidores = targetUser.seguidores.filter(
      id => id !== currentUserId
    );
  } else {
    currentUser.seguidos.push(targetUserId);
    targetUser.seguidores.push(currentUserId);
  }

  saveUsers(users);
  return users;
}

// VOTAR EN ENCUESTA
export function votePoll(
  postId: string,
  optionId: string,
  userId: string
): Post[] {
  const posts = getPosts();

  const post = posts.find(item => item.id === postId);

  if (!post || post.tipo !== "Encuesta") return posts;

  const option = post.votosEncuesta.find(
    item => item.id === optionId
  );

  if (!option) return posts;

  const alreadyVoted = post.votosEncuesta.some(
    item => item.votos.includes(userId)
  );

  if (alreadyVoted) return posts;

  option.votos.push(userId);

  savePosts(posts);
  return posts;
}

// OBTENER RANKING
export function getRanking(): User[] {
  return getUsers().sort((a, b) => b.puntos - a.puntos);
}

// MARCAR NOTIFICACIÓN COMO LEÍDA
export function markNotificationRead(
  notificationId: string
): Notification[] {
  const notifications = getNotifications();

  const notification = notifications.find(
    item => item.id === notificationId
  );

  if (notification) {
    notification.leida = true;
  }

  saveNotifications(notifications);
  return notifications;
}

// ELIMINAR UNA PUBLICACIÓN PROPIA
export function deletePost(postId: string, userId: string): Post[] {
  const posts = getPosts();
  const post = posts.find(item => item.id === postId);
  if (!post || post.autor !== userId) return posts;

  const remaining = posts.filter(item => item.id !== postId);
  savePosts(remaining);

  const users = getUsers();
  const author = users.find(user => user.id === userId);
  if (author) {
    author.puntos = Math.max(0, author.puntos - POINTS.POST);
    saveUsers(users);
  }

  return remaining;
}

// REPORTAR UNA PUBLICACIÓN
export function reportPost(postId: string, userId: string): Post[] {
  const posts = getPosts();
  const post = posts.find(item => item.id === postId);
  if (!post || post.reportes.includes(userId)) return posts;

  post.reportes.push(userId);
  savePosts(posts);
  return posts;
}
