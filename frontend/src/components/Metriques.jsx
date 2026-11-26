const ETIQUETES = {
  dies_desplacament: "Dies de desplaçament",
  hores_espera: "Hores d'espera",
  dies_fins_completar: "Dies fins a completar",
  ocupacio_recursos: "Ocupació de recursos",
};

function format(clau, valor) {
  if (clau === "ocupacio_recursos") return `${Math.round(valor * 100)}%`;
  return valor;
}

export default function Metriques({ metriques }) {
  return (
    <section className="metriques">
      {Object.entries(metriques).map(([clau, valor]) => (
        <div key={clau} className="metrica">
          <span className="metrica-valor">{format(clau, valor)}</span>
          <span className="metrica-nom">{ETIQUETES[clau] ?? clau}</span>
        </div>
      ))}
    </section>
  );
}
