import { useState } from "react";
import { aMinuts, dies } from "../temps.js";

const INICI_JORNADA = 8 * 60;
const FI_JORNADA = 16 * 60;
const HORES = Array.from({ length: (FI_JORNADA - INICI_JORNADA) / 60 + 1 }, (_, i) => 8 + i);

function posicio(inici, fi) {
  const total = FI_JORNADA - INICI_JORNADA;
  return {
    left: `${((aMinuts(inici) - INICI_JORNADA) / total) * 100}%`,
    width: `${((aMinuts(fi) - aMinuts(inici)) / total) * 100}%`,
  };
}

// Gantt d'un dia: una fila per recurs o per participant.
export default function VistaInvestigador({ peticio, pla }) {
  const [dia, setDia] = useState(0);
  const [agrupar, setAgrupar] = useState("recurs");

  const nomProva = Object.fromEntries(peticio.proves.map((p) => [p.id, p.nom]));
  const files =
    agrupar === "recurs"
      ? peticio.recursos.map((r) => ({ id: r.id, nom: r.nom }))
      : peticio.participants.map((p) => ({ id: p.id, nom: p.nom ?? p.id }));

  const delDia = pla.assignacions.filter((a) => a.dia === dia);
  const blocsDe = (fila) =>
    delDia.filter((a) => (agrupar === "recurs" ? a.recursos.includes(fila.id) : a.participant_id === fila.id));

  return (
    <section className="vista">
      <div className="controls">
        <label>
          Dia{" "}
          <select value={dia} onChange={(e) => setDia(Number(e.target.value))}>
            {dies(peticio.horitzo_dies).map((d) => (
              <option key={d} value={d}>
                Dia {d + 1}
              </option>
            ))}
          </select>
        </label>
        <label>
          Agrupar per{" "}
          <select value={agrupar} onChange={(e) => setAgrupar(e.target.value)}>
            <option value="recurs">Recurs</option>
            <option value="participant">Participant</option>
          </select>
        </label>
      </div>

      <div className="gantt">
        <div className="gantt-fila gantt-hores">
          <div className="gantt-nom" />
          <div className="gantt-pista">
            {HORES.map((h) => (
              <span key={h} className="gantt-hora" style={posicio(`${h}:00`, `${h}:00`)}>
                {String(h).padStart(2, "0")}:00
              </span>
            ))}
          </div>
        </div>
        {files.map((fila) => (
          <div key={fila.id} className="gantt-fila">
            <div className="gantt-nom">{fila.nom}</div>
            <div className="gantt-pista">
              {blocsDe(fila).map((a) => (
                <div
                  key={`${a.participant_id}-${a.prova_id}`}
                  className={`gantt-bloc estat-${a.estat}`}
                  style={posicio(a.inici, a.fi)}
                  title={`${a.participant_id} · ${nomProva[a.prova_id]} · ${a.inici}–${a.fi} · ${a.estat}`}
                >
                  <span className="mono">{agrupar === "recurs" ? a.participant_id : a.prova_id}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {delDia.length === 0 && <p>No hi ha proves aquest dia.</p>}
    </section>
  );
}
