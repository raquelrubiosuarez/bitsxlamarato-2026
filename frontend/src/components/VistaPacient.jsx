import { useState } from "react";
import Estat from "./Estat.jsx";
import { aMinuts } from "../temps.js";

// Itinerari per dia d'un participant: hora, lloc, durada i què cal portar.
export default function VistaPacient({ peticio, pla }) {
  const [participantId, setParticipantId] = useState(peticio.participants[0].id);

  const proves = Object.fromEntries(peticio.proves.map((p) => [p.id, p]));
  const recursos = Object.fromEntries(peticio.recursos.map((r) => [r.id, r]));

  const visites = pla.assignacions
    .filter((a) => a.participant_id === participantId)
    .sort((x, y) => x.dia - y.dia || aMinuts(x.inici) - aMinuts(y.inici));

  const perDia = Object.groupBy(visites, (a) => a.dia);

  return (
    <section className="vista">
      <div className="controls">
        <label>
          Participant{" "}
          <select value={participantId} onChange={(e) => setParticipantId(e.target.value)}>
            {peticio.participants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom ?? p.id}
              </option>
            ))}
          </select>
        </label>
      </div>

      {Object.entries(perDia).map(([dia, assignacions]) => {
        const dejuni = assignacions.some((a) => proves[a.prova_id].dejuni);
        const portar = [...new Set(assignacions.flatMap((a) => proves[a.prova_id].portar ?? []))];
        return (
          <article key={dia} className="dia">
            <h2>Dia {Number(dia) + 1}</h2>
            {dejuni && <p className="avis">Cal venir en dejuni.</p>}
            <ol className="itinerari">
              {assignacions.map((a) => {
                const prova = proves[a.prova_id];
                return (
                  <li key={a.prova_id} className="visita">
                    <span className="mono">
                      {a.inici}–{a.fi}
                    </span>
                    <div>
                      <strong>{prova.nom}</strong> · {prova.durada_min} min
                      <div>{a.recursos.map((r) => recursos[r]?.ubicacio ?? r).join(" · ")}</div>
                    </div>
                    <Estat estat={a.estat} />
                  </li>
                );
              })}
            </ol>
            {portar.length > 0 && (
              <p>
                <strong>Cal portar:</strong> {portar.join(", ")}
              </p>
            )}
          </article>
        );
      })}
    </section>
  );
}
