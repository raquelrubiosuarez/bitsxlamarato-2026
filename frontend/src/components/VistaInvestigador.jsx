import { useState } from "react";
import Rajola from "./Rajola.jsx";
import { aMinuts, dies } from "../temps.js";

const INICI = 8 * 60;
const FI = 16 * 60;
const PAS = 15;
const FRANGES = (FI - INICI) / PAS;

// Protocol: una fila per participant i una columna per dia.
function Protocol({ peticio, pla, seleccionat, onTriar }) {
  const proves = Object.fromEntries(peticio.proves.map((p) => [p.id, p]));
  const llistaDies = dies(peticio.horitzo_dies);

  return (
    <div className="desplacable">
      <table className="protocol">
        <caption>Protocol de cada participant</caption>
        <thead>
          <tr>
            <th scope="col">Participant</th>
            <th scope="col">Fetes</th>
            {llistaDies.map((d) => (
              <th key={d} scope="col">
                Dia {d + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {peticio.participants.map((p) => {
            const seves = pla.assignacions.filter((a) => a.participant_id === p.id);
            const fetes = seves.filter((a) => a.estat === "feta").length;
            const actiu = p.id === seleccionat;
            return (
              <tr key={p.id} className={actiu ? "fila-activa" : undefined}>
                <th scope="row">
                  <button type="button" className="enllac mono" onClick={() => onTriar(p.id)} aria-pressed={actiu}>
                    {p.id}
                  </button>
                </th>
                <td className="mono">
                  {fetes}/{p.proves.length}
                </td>
                {llistaDies.map((d) => (
                  <td key={d}>
                    <div className="filera">
                      {seves
                        .filter((a) => a.dia === d)
                        .sort((x, y) => aMinuts(x.inici) - aMinuts(y.inici))
                        .map((a) => (
                          <Rajola
                            key={a.prova_id}
                            prova={proves[a.prova_id]}
                            estat={a.estat}
                            titol={`${p.id}: ${proves[a.prova_id].nom}, dia ${d + 1} a les ${a.inici}`}
                          />
                        ))}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Ocupació d'un dia: una fila per recurs, una rajola per franja de 15 minuts.
function Ocupacio({ peticio, pla, dia, seleccionat, onTriar }) {
  const proves = Object.fromEntries(peticio.proves.map((p) => [p.id, p]));
  const delDia = pla.assignacions.filter((a) => a.dia === dia);
  const hores = Array.from({ length: (FI - INICI) / 60 }, (_, i) => INICI / 60 + i);

  return (
    <div className="desplacable">
      <div className="ocupacio" style={{ "--franges": FRANGES }} role="grid" aria-label={`Ocupació dels recursos, dia ${dia + 1}`}>
        <div className="ocupacio-cap" style={{ gridRow: 1, gridColumn: 1 }} />
        {hores.map((h, i) => (
          <div key={h} className="ocupacio-hora mono" style={{ gridRow: 1, gridColumn: `${2 + i * 4} / span 4` }}>
            {String(h).padStart(2, "0")}:00
          </div>
        ))}
        {peticio.recursos.map((r, fila) => {
          const row = fila + 2;
          return [
            <div key={`${r.id}-nom`} className="ocupacio-recurs" style={{ gridRow: row, gridColumn: 1 }} role="rowheader">
              {r.nom}
            </div>,
            ...Array.from({ length: FRANGES }, (_, i) => (
              <div key={`${r.id}-${i}`} className={`franja${i % 4 === 0 ? " franja-hora" : ""}`} style={{ gridRow: row, gridColumn: 2 + i }} />
            )),
            ...delDia
              .filter((a) => a.recursos.includes(r.id))
              .map((a) => {
                const inici = (aMinuts(a.inici) - INICI) / PAS;
                const span = Math.max(1, Math.round((aMinuts(a.fi) - aMinuts(a.inici)) / PAS));
                return (
                  <Rajola
                    key={`${r.id}-${a.participant_id}-${a.prova_id}`}
                    prova={proves[a.prova_id]}
                    estat={a.estat}
                    etiqueta={span >= 3 ? `${a.prova_id} ${a.participant_id}` : span === 2 ? a.participant_id : a.prova_id}
                    seleccionada={a.participant_id === seleccionat}
                    franges={span}
                    onClick={() => onTriar(a.participant_id)}
                    titol={`${a.participant_id}: ${proves[a.prova_id].nom}, ${a.inici}–${a.fi}`}
                    style={{ gridRow: row, gridColumn: `${2 + inici} / span ${span}` }}
                  />
                );
              }),
          ];
        })}
      </div>
    </div>
  );
}

export default function VistaInvestigador({ peticio, pla, seleccionat, onTriar }) {
  const [dia, setDia] = useState(0);

  return (
    <>
      <section className="bloc">
        <h2>Protocol</h2>
        <Protocol peticio={peticio} pla={pla} seleccionat={seleccionat} onTriar={onTriar} />
      </section>

      <section className="bloc">
        <div className="bloc-cap">
          <h2>Ocupació dels recursos</h2>
          <div className="selector-dia" role="group" aria-label="Dia">
            {dies(peticio.horitzo_dies).map((d) => (
              <button key={d} type="button" aria-pressed={d === dia} onClick={() => setDia(d)}>
                Dia {d + 1}
              </button>
            ))}
          </div>
        </div>
        <Ocupacio peticio={peticio} pla={pla} dia={dia} seleccionat={seleccionat} onTriar={onTriar} />
      </section>
    </>
  );
}
