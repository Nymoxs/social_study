import { useMemo, useState, type FormEvent } from "react";
import "./App.css";
import type { Post, ReactionType, User } from "./types";
import {
  initializeStorage,
  toggleReaction,
  toggleSave,
  getUsers,
  getPosts,
  getNotifications,
  markNotificationRead,
  savePost,
  toggleFollow,
  deletePost,
  reportPost,
  votePoll,
} from "./services/storage";
import logoStudy from "./assets/LOGOstudy.png";
import FiltrosCascada from "./components/FiltrosCascada";
import { FilterProvider } from "./components/FilterContext";
import { useAcademicFilters } from "./components/useAcademicFilters";
import Espacios from "./pages/Espacios";

initializeStorage();

const CURRENT_USER_ID = "u1";

type Screen = "auth" | "feed" | "profile" | "spaces";

function initials(name: string) {
  return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function App() {
  const [screen, setScreen] = useState<Screen>("feed");
  const [users, setUsers] = useState<User[]>(getUsers());
  const [posts, setPosts] = useState<Post[]>(getPosts());
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailPost, setDetailPost] = useState<Post | null>(null);
  const [profileUser, setProfileUser] = useState<User>(getUsers().find(u => u.id === CURRENT_USER_ID)!);
  const [toast, setToast] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [commentTag, setCommentTag] = useState("Duda");
  const [editOpen, setEditOpen] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);
  const [commentEditIndex, setCommentEditIndex] = useState<number | null>(null);
  const [commentEditText, setCommentEditText] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications());
  const [postType, setPostType] = useState<"PDF" | "Cápsula" | "Tu espacio">("PDF");
  const [postPrivacy, setPostPrivacy] = useState("Público");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; dataUrl: string; size: number } | null>(null);
  const [feedFilter, setFeedFilter] = useState<"Todos" | "Guardados">("Todos");

  const currentUser = users.find(u => u.id === CURRENT_USER_ID)!;
  const academicFilters = useAcademicFilters();
  const visiblePosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const careerAliases: Record<string, string[]> = {
      "Ingeniería en Sistemas Computacionales": ["Ingeniería en Sistemas Computacionales", "Ingeniería en Sistemas", "Sistemas Computacionales"],
    };

    const filtered = posts.filter(post => {
      if (feedFilter === "Guardados" && !post.guardados.includes(CURRENT_USER_ID)) return false;
      if (academicFilters.carrera) {
        const aliases = careerAliases[academicFilters.carrera] ?? [academicFilters.carrera];
        if (!aliases.includes(post.carrera)) return false;
      }
      if (academicFilters.semestre && post.semestre !== academicFilters.semestre) return false;
      if (academicFilters.materia && post.materia !== academicFilters.materia) return false;
      if (academicFilters.tema && post.tema !== academicFilters.tema) return false;
      if (!query) return true;
      return `${post.titulo} ${post.descripcion} ${post.materia} ${post.carrera}`.toLowerCase().includes(query);
    });

    if (!academicFilters.hasFilters && !query && feedFilter === "Todos") {
      return [...filtered].sort((a, b) => {
        const scoreA = [...a.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const scoreB = [...b.id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return (scoreA % 7) - (scoreB % 7);
      });
    }
    return filtered;
  }, [posts, search, feedFilter, academicFilters]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function refresh() {
    setUsers(getUsers());
    setPosts(getPosts());
    setNotifications(getNotifications());
  }

  function react(postId: string, type: ReactionType) {
    toggleReaction(postId, CURRENT_USER_ID, type);
    refresh();
  }

  function reactionCounts(post: Post) {
    return post.reacciones ?? {
      meGusta: post.likes ?? [],
      meAyudo: post.gracias ?? [],
      pocoUtil: []
    };
  }

  function activeReaction(post: Post) {
    const reactions = reactionCounts(post);
    if (reactions.meGusta.includes(CURRENT_USER_ID)) return "meGusta";
    if (reactions.meAyudo.includes(CURRENT_USER_ID)) return "meAyudo";
    if (reactions.pocoUtil.includes(CURRENT_USER_ID)) return "pocoUtil";
    return null;
  }

  function publishPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const materia = academicFilters.materia || String(form.get("materia") ?? "Cálculo Diferencial");
    if (!title || !description) return;

    savePost({
      autor: CURRENT_USER_ID,
      carrera: "Ingeniería en Sistemas Computacionales",
      semestre: academicFilters.semestre ?? undefined,
      materia,
      tema: academicFilters.tema || undefined,
      tipo: postType,
      titulo: title,
      descripcion: `${description}${postPrivacy !== "Público" ? ` · Visible para ${postPrivacy}` : ""}`,
      linkArchivo: postType === "PDF" ? uploadedFile?.dataUrl ?? "" : postType === "Tu espacio" ? "live-room" : "",
      adjuntoNombre: postType === "PDF" ? uploadedFile?.name : undefined,
      votosEncuesta: [],
    });
    refresh();
    setCreateOpen(false);
    setUploadedFile(null);
    setPostType("PDF");
    setPostPrivacy("Público");
    event.currentTarget.reset();
    notify("🌿 Aporte publicado — tu racha sigue creciendo");
  }

  function openProfile(user: User) {
    setProfileUser(user);
    setScreen("profile");
  }

  function followProfile() {
    toggleFollow(CURRENT_USER_ID, profileUser.id);
    const updated = getUsers();
    setUsers(updated);
    setProfileUser(updated.find(u => u.id === profileUser.id)!);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const career = String(form.get("career") ?? profileUser.carrera);
    const bio = String(form.get("bio") ?? profileUser.bio);
    const updated = users.map(user => user.id === CURRENT_USER_ID ? { ...user, carrera: career, bio } : user);
    localStorage.setItem("socialStudy_users", JSON.stringify(updated));
    setUsers(updated);
    setProfileUser(updated.find(u => u.id === CURRENT_USER_ID)!);
    setEditOpen(false);
    notify("✓ Perfil actualizado");
  }

  function authSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setScreen("feed");
  }

  if (screen === "auth") {
    return (
      <main className="auth-wrapper">
        <section className="auth-visual">
          <div className="brand"><img className="brand-logo-image" src={logoStudy} alt="Social Study" /><span>Social Study</span></div>
          <div className="visual-content">
            <span className="pill-tag">Comunidad de aprendizaje diario</span>
            <h1>Aprende, comparte y mantén tu racha viva.</h1>
            <p>Sube guías, comparte cápsulas y resuelve dudas con estudiantes de tu carrera.</p>
            <div className="mini-showcase">
              <div className="showcase-card"><div className="showcase-icon terra">🔥</div><div><strong>Rachas compartidas</strong><span>Estudia a diario con la comunidad</span></div></div>
              <div className="showcase-card"><div className="showcase-icon gold">★</div><div><strong>Material validado</strong><span>Reconoce lo que sí te ayudó</span></div></div>
              <div className="showcase-card"><div className="showcase-icon eucalyptus">🎥</div><div><strong>Tu espacio</strong><span>Sesiones en vivo y colaborativas</span></div></div>
            </div>
          </div>
          <p className="visual-footer">Social Study · 2026</p>
        </section>
        <section className="auth-form-section">
          <div className="auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab ${authMode === "login" ? "active" : ""}`} onClick={() => setAuthMode("login")}>Iniciar sesión</button>
              <button className={`auth-tab ${authMode === "register" ? "active" : ""}`} onClick={() => setAuthMode("register")}>Crear cuenta</button>
            </div>
            <form className="form-body" onSubmit={authSubmit}>
              <h2>{authMode === "login" ? "Bienvenido de nuevo" : "Únete a la comunidad"}</h2>
              {authMode === "register" && (
                <div className="form-grid-2">
                  <div className="input-group"><label>Nombre de usuario</label><input required placeholder="alex_rivera" /></div>
                  <div className="input-group"><label>Carrera</label><select required defaultValue=""><option value="" disabled>Selecciona...</option><option>Sistemas Computacionales</option><option>Administración</option><option>Ingeniería Industrial</option></select></div>
                </div>
              )}
              <div className="input-group"><label>Correo electrónico</label><input type="email" required placeholder="tu.correo@universidad.edu" /></div>
              <div className="input-group"><label>Contraseña</label><input type="password" required minLength={8} placeholder="••••••••" /></div>
              {authMode === "register" && <label className="privacy-check"><input type="checkbox" required /><span>Acepto el aviso de <strong>Protección de Datos</strong>.</span></label>}
              <button className="btn-submit" type="submit">{authMode === "login" ? "Entrar a Social Study →" : "Crear mi cuenta ✓"}</button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "spaces") {
    return (
      <>
        <header className="topbar">
          <button className="brand brand-button" onClick={() => setScreen("feed")}><img className="brand-logo-image" src={logoStudy} alt="Social Study" /><span>Social Study</span></button>
          <div className="spaces-top-search" />
          <button className="back-link" onClick={() => setScreen("feed")}>← Volver al Feed</button>
        </header>
        <Espacios onNotify={notify} />
      </>
    );
  }

  if (screen === "profile") {
    const isOwn = profileUser.id === CURRENT_USER_ID;
    const isFollowing = profileUser.seguidores.includes(CURRENT_USER_ID);
    const covers = ["cover-eucalyptus", "cover-sage", "cover-terracotta"];
    return (
      <>
        <header className="topbar">
          <button className="brand brand-button" onClick={() => setScreen("feed")}><img className="brand-logo-image" src={logoStudy} alt="Social Study" /><span>Social Study</span></button>
          <div className="view-switcher">
            <button className={`switch-btn ${isOwn ? "active" : ""}`} onClick={() => setProfileUser(currentUser)}>Mi Perfil</button>
            <button className={`switch-btn ${!isOwn ? "active" : ""}`} onClick={() => setProfileUser(users.find(u => u.id !== CURRENT_USER_ID) ?? currentUser)}>Otro Usuario</button>
          </div>
          <button className="back-link" onClick={() => setScreen("feed")}>← Volver al Feed</button>
        </header>
        <div className="profile-layout">
          <main className="profile-main">
            <section className="profile-card">
              <div className={`cover-banner ${covers[coverIndex]}`}>
                {isOwn && <button className="btn-cover" onClick={() => setCoverIndex((coverIndex + 1) % covers.length)}>📷 Cambiar portada</button>}
              </div>
              <div className="profile-info-body">
                <div className="avatar-action-row">
                  {profileUser.foto ? <img className="profile-avatar" src={profileUser.foto} alt="" /> : <div className="profile-avatar av-eucalyptus">{initials(profileUser.nombre)}</div>}
                  <div className="action-group">
                    {isOwn ? <><button className="btn-outline" onClick={() => setEditOpen(true)}>Editar perfil</button><button className="btn-primary" onClick={() => setCreateOpen(true)}>+ Crear aporte</button></> : <><button className="btn-primary" onClick={followProfile}>{isFollowing ? "Siguiendo" : "Seguir"}</button><button className="btn-report" onClick={() => notify("🚩 Reporte enviado")}>Reportar</button></>}
                  </div>
                </div>
                <div className="identity-block">
                  <div className="name-line"><h1>{profileUser.nombre}</h1><span className="handle">@{profileUser.usuario}</span><span className="streak-badge">🔥 {profileUser.racha} días</span></div>
                  <p className="career-line">{profileUser.carrera}</p><p className="bio-text">{profileUser.bio}</p>
                  <div className="skills-tags">{profileUser.habilidades.map(skill => <span className="skill-chip" key={skill}>{skill}</span>)}</div>
                </div>
                <div className="stats-bar">
                  <div className="stat-item"><strong>{profileUser.seguidores.length}</strong><span>Seguidores</span></div>
                  <div className="stat-item"><strong>{profileUser.seguidos.length}</strong><span>Seguidos</span></div>
                  <div className="stat-item"><strong className="star-accent">★ {profileUser.puntos}</strong><span>Puntos</span></div>
                  <div className="stat-item"><strong>{posts.filter(post => post.autor === profileUser.id).length}</strong><span>Aportes</span></div>
                </div>
              </div>
            </section>
            {posts.filter(post => post.autor === profileUser.id).slice(0, 3).map(post => (
              <article className="profile-post" key={post.id} onClick={() => setDetailPost(post)}><strong>{post.titulo}</strong><p>{post.descripcion}</p><span>{post.materia}</span></article>
            ))}
          </main>
          <aside className="profile-sidebar"><section className="widget-card"><h4>Comunidad sugerida</h4>{users.filter(u => u.id !== CURRENT_USER_ID).slice(0, 4).map(user => <div className="suggest-item" key={user.id}><span className="avatar-xs av-sage">{initials(user.nombre)}</span><button className="suggest-info" onClick={() => openProfile(user)}><strong>{user.nombre}</strong><span>{user.carrera}</span></button></div>)}</section></aside>
        </div>
        {editOpen && <div className="modal-overlay" onClick={() => setEditOpen(false)}><form className="modal-card edit-modal" onSubmit={saveProfile} onClick={e => e.stopPropagation()}><h3>Editar mi perfil</h3><input name="career" defaultValue={profileUser.carrera} /><textarea name="bio" rows={3} defaultValue={profileUser.bio} /><div className="modal-actions"><button type="button" className="btn-outline" onClick={() => setEditOpen(false)}>Cancelar</button><button type="submit" className="btn-primary">Guardar</button></div></form></div>}
      </>
    );
  }

  return (
    <>
      <header className="topbar">
        <button className="brand brand-button" onClick={() => setScreen("feed")}><img className="brand-logo-image" src={logoStudy} alt="Social Study" /><span>Social Study</span></button>
        <div className="search-box">⌕<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar guías, materias o etiquetas..." /></div>
        <div className="topbar-actions">
          <span className="streak-pill">🔥 <strong>{currentUser.racha} días</strong></span>
          <button className="btn-primary" onClick={() => setCreateOpen(true)}><span>＋</span> Crear aporte</button>
          <button className="notification-button" title="Notificaciones" onClick={() => setNotificationsOpen(!notificationsOpen)}>🔔{notifications.filter(item => item.usuarioDestino === CURRENT_USER_ID && !item.leida).length > 0 && <span className="notification-badge">{notifications.filter(item => item.usuarioDestino === CURRENT_USER_ID && !item.leida).length}</span>}</button>
          <button className="avatar-sm av-eucalyptus profile-avatar-button" title="Ir a mi perfil" onClick={() => openProfile(currentUser)}>{initials(currentUser.nombre)}</button>
          <button className="logout-button" title="Cerrar sesión" onClick={() => setScreen("auth")}>Salir</button>
        </div>
      </header>

      {notificationsOpen && <aside className="notifications-panel">
        <div className="notifications-header"><strong>Notificaciones</strong><button type="button" onClick={() => setNotificationsOpen(false)}>✕</button></div>
        {notifications.filter(item => item.usuarioDestino === CURRENT_USER_ID).length === 0 ? (
          <p className="notifications-empty">No tienes notificaciones nuevas.</p>
        ) : notifications.filter(item => item.usuarioDestino === CURRENT_USER_ID).map(item => (
          <button type="button" className={`notification-item ${item.leida ? "" : "unread"}`} key={item.id} onClick={() => { markNotificationRead(item.id); setNotifications(getNotifications()); const post = posts.find(p => p.id === item.postId); if (post) setDetailPost(post); setNotificationsOpen(false); }}>
            <span>{item.mensaje}</span><small>{new Date(item.fecha).toLocaleString("es")}</small>
          </button>
        ))}
      </aside>}

      <div className="app-layout">
        <aside className="sidebar-left">
          <nav className="nav-menu"><button className={`nav-item ${feedFilter === "Todos" ? "active" : ""}`} onClick={() => { setFeedFilter("Todos"); setScreen("feed"); }}>Inicio</button><button className={`nav-item ${feedFilter === "Guardados" ? "active" : ""}`} onClick={() => { setFeedFilter("Guardados"); setScreen("feed"); }}>Guardados</button><button className="nav-item" onClick={() => openProfile(currentUser)}>Mi Perfil</button><button className="nav-item" onClick={() => setScreen("auth")}>Cerrar sesión</button><button className="nav-item" onClick={() => setScreen("spaces")}>Espacios</button></nav>
          <div className="widget-card"><h4>Tu espacio (En vivo)</h4><div className="live-room-mini"><span className="live-dot">● EN VIVO</span><strong>Repaso de Cálculo Vectorial</strong><span>24 estudiantes conectados</span><button className="btn-outline-sm" onClick={() => notify("🎥 Entrando a Tu espacio...")}>Unirse</button></div></div>
        </aside>

        <main className="feed-main">
          <FiltrosCascada />
          {visiblePosts.length === 0 ? (
            <section className="empty-search-state" role="status">
              <div className="empty-search-icon">⌕</div>
              <h2>No hay resultados</h2>
              <p>Prueba con otra materia, guía o etiqueta.</p>
              <button type="button" className="btn-outline-sm" onClick={() => setSearch("")}>Limpiar búsqueda</button>
            </section>
          ) : visiblePosts.map(post => {
            const author = users.find(u => u.id === post.autor) ?? currentUser;
            const reactions = reactionCounts(post);
            const active = activeReaction(post);
            return (
              <article className="post-card" key={post.id}>
                <div className="post-header"><button className="author-row author-button" onClick={() => openProfile(author)}><img className="avatar-sm" src={author.foto} alt="" /><div><strong>{author.nombre}</strong><span className="post-time">Hoy · {post.carrera}</span></div></button><button className="btn-ghost-sm" onClick={() => setDetailPost(post)}>Ver detalle</button></div>
                <p className="post-text"><strong>{post.titulo}</strong> — {post.descripcion}</p>
                {post.linkArchivo && (post.tipo === "PDF" || post.tipo === "Guia") && <button type="button" className="attachment-pdf attachment-button" onClick={() => setDetailPost(post)}><div className="pdf-badge">{post.tipo === "PDF" ? "PDF" : "DOC"}</div><div className="pdf-info"><strong>{post.adjuntoNombre ?? "Material académico adjunto"}</strong><span>{post.materia} · Archivo disponible</span></div><span className="link-accent">Abrir/descargar →</span></button>}
                <div className="post-actions">
                  <button className={`reaction-btn ${active === "meAyudo" ? "active-star" : ""}`} onClick={() => react(post.id, "meAyudo")}>★ <span>Me ayudó</span><strong className="count">{reactions.meAyudo.length}</strong></button>
                  <button className={`reaction-btn ${active === "meGusta" ? "active-like" : ""}`} onClick={() => react(post.id, "meGusta")}>♡ <span>Me gusta</span><strong className="count">{reactions.meGusta.length}</strong></button>
                  <button className={`reaction-btn ${active === "pocoUtil" ? "active-dislike" : ""}`} onClick={() => react(post.id, "pocoUtil")}>⊘ <span>Poco útil</span><strong className="count">{reactions.pocoUtil.length}</strong></button>
                  <button className={`save-post-button ${post.guardados.includes(CURRENT_USER_ID) ? "saved" : ""}`} onClick={() => { const wasSaved = post.guardados.includes(CURRENT_USER_ID); toggleSave(post.id, CURRENT_USER_ID); refresh(); notify(wasSaved ? "☆ Eliminado de guardados" : "☆ Guardado en tu colección"); }}>☆ Guardar</button>
                  {post.autor === CURRENT_USER_ID ? <button className="post-menu-button delete" onClick={() => { if (!window.confirm("¿Eliminar esta publicación?")) return; setPosts(deletePost(post.id, CURRENT_USER_ID)); refresh(); notify("🗑️ Publicación eliminada"); }}>Eliminar</button> : <button className="post-menu-button" onClick={() => { setPosts(reportPost(post.id, CURRENT_USER_ID)); refresh(); notify("🚩 Publicación reportada"); }}>Reportar</button>}
                  <button className="btn-comment-trigger" onClick={() => setDetailPost(post)}>💬 {post.comentarios.length} comentarios</button>
                </div>
              </article>
            );
          })}
        </main>

        <aside className="sidebar-right"><div className="widget-card"><h4>Tendencias de estudio</h4><div className="trends-list"><span className="trend-chip">#EstructurasDeDatos</span><span className="trend-chip">#BasesDeDatosSQL</span><span className="trend-chip">#Parciales2026</span><span className="trend-chip">#DiseñoUX</span></div></div></aside>
      </div>

      {createOpen && <div className="modal-overlay" onClick={() => setCreateOpen(false)}><div className="modal-card modal-create" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><div className="author-row"><div className="avatar-sm av-eucalyptus">{initials(currentUser.nombre)}</div><div><h3>Crear nuevo aporte</h3><select className="mini-select" value={postPrivacy} onChange={e => setPostPrivacy(e.target.value)}><option>Público</option><option>Solo mi carrera</option><option>Solo mis seguidores</option></select></div></div><button className="icon-close-btn" onClick={() => setCreateOpen(false)}>✕</button></div>
        <form className="modal-body" onSubmit={publishPost}>
          <div className="type-pills"><button type="button" className={`type-pill ${postType === "PDF" ? "active" : ""}`} onClick={() => setPostType("PDF")}>📄 Apunte / PDF</button><button type="button" className={`type-pill ${postType === "Cápsula" ? "active" : ""}`} onClick={() => setPostType("Cápsula")}>🎬 Cápsula</button><button type="button" className={`type-pill ${postType === "Tu espacio" ? "active" : ""}`} onClick={() => setPostType("Tu espacio")}>🔴 Tu espacio</button></div>
          <div className="form-row-2"><div className="field-group"><label>Materia</label><select name="materia"><option>Bases de Datos</option><option>Programación Web</option><option>Cálculo y Álgebra</option><option>Diseño UX / UI</option></select></div><div className="field-group"><label>Título corto</label><input name="title" required placeholder="Ej. Resumen de Consultas SQL" /></div></div>
          <div className="field-group"><label>Descripción</label><textarea name="description" rows={3} required placeholder="Explica brevemente qué compartirás..." /></div>
          {postType === "PDF" && <div className="dropzone-box"><input type="file" id="postFile" hidden accept=".pdf,image/*,.doc,.docx,.ppt,.pptx,.txt" onChange={e => { const file = e.target.files?.[0]; if (!file) return; if (file.size > 5 * 1024 * 1024) { notify("El archivo supera el límite de 5 MB"); e.target.value = ""; return; } const reader = new FileReader(); reader.onload = () => setUploadedFile({ name: file.name, dataUrl: String(reader.result), size: file.size }); reader.readAsDataURL(file); }}/><label htmlFor="postFile"><strong>{uploadedFile ? `✓ Archivo listo: ${uploadedFile.name}` : "📎 Adjuntar archivo (Máx. 5 MB)"}</strong></label></div>}
          {postType === "Cápsula" && <div className="field-info">Se creará una cápsula educativa breve con el título y la descripción.</div>}
          {postType === "Tu espacio" && <div className="field-info">La publicación creará un espacio visible para que otros puedan unirse al repaso.</div>}
          <div className="modal-footer"><button type="button" className="btn-ghost" onClick={() => setCreateOpen(false)}>Cancelar</button><button type="submit" className="btn-primary">Publicar en el Feed</button></div>
        </form>
      </div></div>}

      {detailPost && <div className="modal-overlay" onClick={() => setDetailPost(null)}><div className="modal-card modal-detail" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><div className="author-row"><div className="avatar-md av-sage">{initials(users.find(u => u.id === detailPost.autor)?.nombre ?? "Usuario")}</div><div><strong>{users.find(u => u.id === detailPost.autor)?.nombre}</strong><span className="post-time">{detailPost.materia} · Hoy</span></div></div><button className="icon-close-btn" onClick={() => setDetailPost(null)}>✕</button></div>
        <div className="modal-scroll-body">
          <h2 className="detail-title">{detailPost.titulo}</h2>
          <p className="post-text">{detailPost.descripcion}</p>
          {detailPost.linkArchivo && detailPost.linkArchivo !== "live-room" && <div className="attachment-pdf"><div className="pdf-badge">ARCHIVO</div><div className="pdf-info"><strong>Material adjunto</strong><span>{detailPost.materia} · Archivo compartido</span></div>{detailPost.linkArchivo.startsWith("data:") ? <a className="btn-outline-sm download-link" href={detailPost.linkArchivo} download="Social-Study-apunte">Descargar</a> : <a className="btn-outline-sm download-link" href={detailPost.linkArchivo} target="_blank" rel="noreferrer">Abrir</a>}</div>}
          {detailPost.linkArchivo === "live-room" && <div className="live-detail-card"><span className="live-dot">● EN VIVO</span><strong>Espacio de estudio activo</strong><button className="btn-primary" onClick={() => notify("🎥 Te has unido al espacio de estudio")}>Unirme ahora</button></div>}
          <div className="comments-section">
            <h4>Discusión y dudas ({detailPost.comentarios.length})</h4>
            <form className="comment-composer" onSubmit={e => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("comment") as HTMLTextAreaElement;
              if (!input.value.trim()) return;
              const next = posts.map(post => post.id === detailPost.id ? {
                ...post,
                comentarios: [`${commentTag}: ${input.value.trim()} — ${currentUser.nombre}`, ...post.comentarios]
              } : post);
              setPosts(next);
              localStorage.setItem("socialStudy_posts", JSON.stringify(next));
              setDetailPost(next.find(post => post.id === detailPost.id) ?? null);
              input.value = "";
              notify("💬 Comentario publicado");
            }}>
              <textarea name="comment" rows={2} required placeholder="Escribe una duda puntual o un aporte extra..." />
              <div className="composer-footer">
                <div className="tag-selector">
                  <button type="button" className={`type-chip ${commentTag === "Duda" ? "active" : ""}`} onClick={() => setCommentTag("Duda")}>❓ Duda</button>
                  <button type="button" className={`type-chip ${commentTag === "Aporte" ? "active" : ""}`} onClick={() => setCommentTag("Aporte")}>💡 Aporte</button>
                </div>
                <button type="submit" className="btn-primary-sm">Comentar</button>
              </div>
            </form>
            <div className="comments-list">
              {detailPost.comentarios.map((comment, index) => {
                const isOwnComment = comment.endsWith(`— ${currentUser.nombre}`) || comment.endsWith(`— ${currentUser.nombre} (editado)`);
                const edited = comment.endsWith("(editado)");
                return (
                  <div className="comment-item" key={index}>
                    {commentEditIndex === index ? (
                      <form className="comment-edit-form" onSubmit={e => {
                        e.preventDefault();
                        if (!commentEditText.trim()) return;
                        const cleaned = comment.replace(/ \(editado\)$/, "");
                        const authorSuffix = ` — ${currentUser.nombre}`;
                        const withoutAuthor = cleaned.endsWith(authorSuffix) ? cleaned.slice(0, -authorSuffix.length) : cleaned;
                        const tagPrefix = withoutAuthor.includes(":") ? withoutAuthor.slice(0, withoutAuthor.indexOf(":") + 1) : `${commentTag}:`;
                        const updatedComment = `${tagPrefix} ${commentEditText.trim()} — ${currentUser.nombre} (editado)`;
                        const next = posts.map(post => post.id === detailPost.id ? {
                          ...post,
                          comentarios: post.comentarios.map((item, itemIndex) => itemIndex === index ? updatedComment : item)
                        } : post);
                        setPosts(next);
                        localStorage.setItem("socialStudy_posts", JSON.stringify(next));
                        setDetailPost(next.find(post => post.id === detailPost.id) ?? null);
                        setCommentEditIndex(null);
                        setCommentEditText("");
                        notify("✏️ Comentario editado");
                      }}>
                        <textarea value={commentEditText} onChange={e => setCommentEditText(e.target.value)} rows={2} autoFocus />
                        <div className="comment-actions"><button type="submit" className="btn-primary-sm">Guardar</button><button type="button" className="btn-ghost-sm" onClick={() => setCommentEditIndex(null)}>Cancelar</button></div>
                      </form>
                    ) : (
                      <><p>{comment}</p>{edited && <span className="edited-label">(editado)</span>}{isOwnComment && <div className="comment-actions"><button type="button" className="comment-action" onClick={() => { setCommentEditIndex(index); setCommentEditText(comment.replace(/^([^:]+):\s*/, "").replace(/ — [^(]+(?:\(editado\))?$/, "")); }}>Editar</button><button type="button" className="comment-action delete" onClick={() => { const next = posts.map(post => post.id === detailPost.id ? { ...post, comentarios: post.comentarios.filter((_, itemIndex) => itemIndex !== index) } : post); setPosts(next); localStorage.setItem("socialStudy_posts", JSON.stringify(next)); setDetailPost(next.find(post => post.id === detailPost.id) ?? null); notify("🗑️ Comentario eliminado"); }}>Eliminar</button></div>}</>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {detailPost.tipo === "Encuesta" && detailPost.votosEncuesta.length > 0 && <div className="poll-section"><h4>Encuesta</h4>{detailPost.votosEncuesta.map(option => { const total = detailPost.votosEncuesta.reduce((sum, item) => sum + item.votos.length, 0); const percentage = total ? Math.round((option.votos.length / total) * 100) : 0; const alreadyVoted = detailPost.votosEncuesta.some(item => item.votos.includes(CURRENT_USER_ID)); return <button key={option.id} type="button" className="poll-option" disabled={alreadyVoted} onClick={() => { setPosts(votePoll(detailPost.id, option.id, CURRENT_USER_ID)); refresh(); setDetailPost(getPosts().find(post => post.id === detailPost.id) ?? null); notify("✓ Voto registrado"); }}><span>{option.texto}</span><strong>{option.votos.length} · {percentage}%</strong><i style={{ width: `${percentage}%` }} /></button>; })}</div>}
        </div>
      </div></div>}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

export default function AppWrapper() {
  return (
    <FilterProvider>
      <App />
    </FilterProvider>
  );
}