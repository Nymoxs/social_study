import { useState, type FormEvent } from "react";
import { liveSpaces, type LiveSpace } from "../data/academicCatalog";
import TarjetaEspacio from "../components/TarjetaEspacio";

interface Props {
  onNotify: (message: string) => void;
}

export default function Espacios({ onNotify }: Props) {
  const [spaces, setSpaces] = useState<LiveSpace[]>(liveSpaces);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinedId, setJoinedId] = useState<string | null>(null);

  function joinSpace(space: LiveSpace) {
    setJoinedId(joinedId === space.id ? null : space.id);
    onNotify(joinedId === space.id ? `Has salido de ${space.titulo}` : `Te uniste a ${space.titulo}`);
  }

  function createSpace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const matter = String(form.get("matter") ?? "").trim();
    if (!title || !matter) return;

    setSpaces(current => [{
      id: crypto.randomUUID(),
      titulo: title,
      anfitrion: "Ana López",
      materia: matter,
      carrera: String(form.get("career") ?? "Ingeniería en Sistemas Computacionales"),
      conectados: 1,
    }, ...current]);
    setCreateOpen(false);
    event.currentTarget.reset();
    onNotify("🔴 Espacio creado y publicado");
  }

  return (
    <main className="spaces-view">
      <div className="spaces-header">
        <div>
          <span className="spaces-eyebrow">Comunidad en directo</span>
          <h1>Espacios en vivo</h1>
          <p>Únete a repasos y sesiones educativas con otros estudiantes.</p>
        </div>
        <button type="button" className="btn-primary create-space-button" onClick={() => setCreateOpen(true)}>＋ Crear Espacio</button>
      </div>

      <section className="live-spaces-grid">
        {spaces.map(space => <TarjetaEspacio key={space.id} space={joinedId === space.id ? { ...space, conectados: space.conectados + 1 } : space} onJoin={joinSpace} />)}
      </section>

      {createOpen && (
        <div className="modal-overlay" onClick={() => setCreateOpen(false)}>
          <form className="modal-card create-space-modal" onSubmit={createSpace} onClick={event => event.stopPropagation()}>
            <div className="modal-header"><h3>Crear nuevo espacio</h3><button type="button" className="icon-close-btn" onClick={() => setCreateOpen(false)}>✕</button></div>
            <div className="modal-body">
              <div className="field-group"><label>Título del espacio</label><input name="title" required placeholder="Ej. Repaso de consultas SQL" /></div>
              <div className="field-group"><label>Materia</label><input name="matter" required placeholder="Ej. Bases de Datos" /></div>
              <div className="field-group"><label>Carrera</label><select name="career"><option>Ingeniería en Sistemas Computacionales</option><option>Medicina</option><option>Administración</option></select></div>
              <div className="modal-footer"><button type="button" className="btn-ghost" onClick={() => setCreateOpen(false)}>Cancelar</button><button type="submit" className="btn-primary">Iniciar en vivo</button></div>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
