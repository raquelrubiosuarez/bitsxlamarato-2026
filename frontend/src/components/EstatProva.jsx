// L'estat es mostra amb text i amb un símbol, mai només amb color.
const ESTATS = {
  planificada: { simbol: "○", text: "Planificada" },
  confirmada: { simbol: "●", text: "Confirmada" },
  feta: { simbol: "✓", text: "Feta" },
};

export default function EstatProva({ estat }) {
  const { simbol, text } = ESTATS[estat] ?? ESTATS.planificada;
  return (
    <span className={`estat estat-${estat}`}>
      <span aria-hidden="true">{simbol}</span> {text}
    </span>
  );
}
