// L'estat es mostra amb forma (glif SVG) i amb text, mai només amb color.
export const ESTATS = {
  planificada: "Planificada",
  confirmada: "Confirmada",
  feta: "Feta",
};

export function GlifEstat({ estat, mida = 12 }) {
  return (
    <svg className={`glif glif-${estat}`} width={mida} height={mida} viewBox="0 0 12 12" aria-hidden="true">
      {estat === "feta" && <path d="M2 6.5 L5 9.5 L10 2.5" fill="none" strokeWidth="2" />}
      {estat === "confirmada" && <rect x="2" y="2" width="8" height="8" />}
      {estat === "planificada" && <rect x="2.5" y="2.5" width="7" height="7" fill="none" strokeWidth="1" strokeDasharray="2 1.5" />}
    </svg>
  );
}

export default function EstatProva({ estat }) {
  return (
    <span className={`estat estat-${estat}`}>
      <GlifEstat estat={estat} /> {ESTATS[estat] ?? estat}
    </span>
  );
}
