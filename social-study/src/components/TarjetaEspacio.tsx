import type { LiveSpace } from "../data/academicCatalog";

interface Props {
  space: LiveSpace;
  onJoin: (space: LiveSpace) => void;
}

export default function TarjetaEspacio({ space, onJoin }: Props) {
  return (
    <article className="live-space-card">
      <div className="live-space-top">
        <span className="live-badge"><i /> EN VIVO</span>
        <span className="live-students">{space.conectados} conectados</span>
      </div>
      <div className="live-space-body">
        <span className="live-space-career">{space.carrera}</span>
        <h3>{space.titulo}</h3>
        <p><strong>Anfitrión:</strong> {space.anfitrion}</p>
        <p><strong>Materia:</strong> {space.materia}</p>
      </div>
      <button type="button" className="join-space-button" onClick={() => onJoin(space)}>Unirse al espacio</button>
    </article>
  );
}
