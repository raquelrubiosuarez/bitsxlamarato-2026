const nombre = new Intl.NumberFormat("ca", { maximumFractionDigits: 1 });

const FRASES = {
  dies_desplacament: (v) => [nombre.format(v), "dies de desplaçament en total"],
  hores_espera: (v) => [`${nombre.format(v)} h`, "d'espera entre proves"],
  dies_fins_completar: (v) => [nombre.format(v), "dies fins a completar el protocol"],
  ocupacio_recursos: (v) => [`${Math.round(v * 100)} %`, "d'ocupació dels recursos"],
};

export default function Metriques({ metriques }) {
  return (
    <dl className="metriques">
      {Object.entries(metriques).map(([clau, valor]) => {
        const [xifra, text] = FRASES[clau]?.(valor) ?? [valor, clau];
        return (
          <div key={clau}>
            <dt className="metrica-xifra">{xifra}</dt>
            <dd>{text}</dd>
          </div>
        );
      })}
    </dl>
  );
}
