import { GlifEstat, ESTATS } from "./EstatProva.jsx";

// La rajola: quadrat amb filet del color de la categoria de la prova.
// L'estat es llegeix per la forma: vora discontínua (planificada),
// vora contínua (confirmada) o rajola plena (feta), més el glif.
export default function Rajola({ prova, estat, etiqueta, seleccionada, style, onClick, titol, franges = 1 }) {
  const Element = onClick ? "button" : "span";
  return (
    <Element
      type={onClick ? "button" : undefined}
      className={`rajola cat-${prova?.categoria ?? "altres"} rajola-${estat}${seleccionada ? " rajola-seleccionada" : ""}`}
      style={style}
      onClick={onClick}
      title={titol}
      aria-label={titol ?? `${prova?.nom}, ${ESTATS[estat]}`}
    >
      {Array.from({ length: franges - 1 }, (_, k) => (
        <span key={k} className="rajola-junta" style={{ left: `${((k + 1) * 100) / franges}%` }} aria-hidden="true" />
      ))}
      <span className="rajola-codi">{etiqueta ?? prova?.id}</span>
      <GlifEstat estat={estat} mida={10} />
    </Element>
  );
}
