import EstatProva from "./EstatProva.jsx";
import Rajola from "./Rajola.jsx";
import { aMinuts, durada, pavello } from "../temps.js";

// El dia d'un participant com un itinerari entre pavellons.
function Itinerari({ visites, proves, recursos }) {
  return (
    <ol className="itinerari">
      {visites.map((a, i) => {
        const prova = proves[a.prova_id];
        const lloc = recursos[a.recursos[0]]?.ubicacio ?? a.recursos[0];
        const anterior = visites[i - 1];
        const llocAnterior = anterior && recursos[anterior.recursos[0]]?.ubicacio;
        const canvi = anterior && pavello(llocAnterior) !== pavello(lloc);
        const espera = anterior ? aMinuts(a.inici) - aMinuts(anterior.fi) : 0;
        return (
          <li key={a.prova_id} className="parada">
            {anterior && (
              <div className={`tram${canvi ? " tram-canvi" : ""}`}>
                <span className="tram-text">
                  {canvi ? `Canvi de pavelló: de ${pavello(llocAnterior)} a ${pavello(lloc)}. ` : "Al mateix pavelló. "}
                  {espera > 0 ? `${durada(espera)} fins a la prova següent.` : "Sense espera."}
                </span>
              </div>
            )}
            <div className="parada-cos">
              <span className="parada-hora mono">{a.inici}</span>
              <Rajola prova={prova} estat={a.estat} />
              <div className="parada-text">
                <h4>{prova.nom}</h4>
                <p>
                  {lloc}. Fins a les <span className="mono">{a.fi}</span> ({durada(prova.durada_min)}).
                </p>
                <EstatProva estat={a.estat} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function VistaPacient({ peticio, pla, seleccionat, onTriar }) {
  const proves = Object.fromEntries(peticio.proves.map((p) => [p.id, p]));
  const recursos = Object.fromEntries(peticio.recursos.map((r) => [r.id, r]));
  const participant = peticio.participants.find((p) => p.id === seleccionat) ?? peticio.participants[0];

  const visites = pla.assignacions
    .filter((a) => a.participant_id === participant.id)
    .sort((x, y) => x.dia - y.dia || aMinuts(x.inici) - aMinuts(y.inici));
  const perDia = Object.entries(Object.groupBy(visites, (a) => a.dia));
  const pendents = participant.proves.filter((id) => !visites.some((a) => a.prova_id === id));

  return (
    <section className="bloc">
      <div className="bloc-cap">
        <h2>
          Itinerari de <span className="mono">{participant.id}</span>
        </h2>
        <label className="camp">
          Participant
          <select value={participant.id} onChange={(e) => onTriar(e.target.value)}>
            {peticio.participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id}
              </option>
            ))}
          </select>
        </label>
      </div>

      {pendents.length > 0 && (
        <p className="avis">
          Falta programar: {pendents.map((id) => proves[id].nom).join(", ")}.
        </p>
      )}

      <div className="dies">
        {perDia.map(([dia, del]) => {
          const dejuni = del.some((a) => proves[a.prova_id].dejuni);
          const portar = [...new Set(del.flatMap((a) => proves[a.prova_id].portar ?? []))];
          return (
            <article key={dia} className="dia">
              <h3>
                Dia {Number(dia) + 1}
                <span className="dia-franja mono">
                  {del[0].inici}–{del.at(-1).fi}
                </span>
              </h3>
              <div className="abans">
                {dejuni && <p className="avis">Cal venir en dejuni.</p>}
                {portar.length > 0 && (
                  <p>
                    <strong>Cal portar:</strong> {portar.join("; ")}.
                  </p>
                )}
              </div>
              <Itinerari visites={del} proves={proves} recursos={recursos} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
