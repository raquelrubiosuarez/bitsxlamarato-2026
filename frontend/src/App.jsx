import { useState } from "react";
import { demanarPla } from "./api.js";
import { PETICIO_EXEMPLE } from "./exemple.js";
import Capcalera from "./components/Capcalera.jsx";
import Llegenda from "./components/Llegenda.jsx";
import Metriques from "./components/Metriques.jsx";
import VistaInvestigador from "./components/VistaInvestigador.jsx";
import VistaPacient from "./components/VistaPacient.jsx";

const VISTES = [
  { id: "investigador", nom: "Equip investigador" },
  { id: "pacient", nom: "Pacient i cuidador" },
];

export default function App() {
  const [peticio] = useState(PETICIO_EXEMPLE);
  const [pla, setPla] = useState(null);
  const [simulat, setSimulat] = useState(false);
  const [carregant, setCarregant] = useState(false);
  const [vista, setVista] = useState("investigador");
  const [seleccionat, setSeleccionat] = useState(PETICIO_EXEMPLE.participants[0].id);

  async function planificar() {
    setCarregant(true);
    const resultat = await demanarPla(peticio);
    setPla(resultat.pla);
    setSimulat(resultat.simulat);
    setCarregant(false);
  }

  function obrirItinerari(id) {
    setSeleccionat(id);
    setVista("pacient");
  }

  return (
    <>
      <Capcalera>
        <button type="button" className="boto-principal" onClick={planificar} disabled={carregant}>
          {carregant ? "Planificant…" : pla ? "Torna a planificar" : "Planificar"}
        </button>
      </Capcalera>

      <main className="app">
        <p className="resum">
          {peticio.participants.length} participants, {peticio.proves.length} proves i {peticio.recursos.length} recursos en
          un horitzó de {peticio.horitzo_dies} dies.
        </p>

        {simulat && (
          <p className="avis" role="status">
            L'API de planificació no respon. Es mostra un pla d'exemple generat al navegador.
          </p>
        )}

        {!pla && (
          <section className="buit">
            <h2>Encara no hi ha pla</h2>
            <p>Prem Planificar per repartir les proves de tots els participants entre els dies i els recursos disponibles.</p>
          </section>
        )}

        {pla && !pla.factible && (
          <section className="avis" role="alert">
            <h2>No hi ha cap pla que compleixi totes les restriccions</h2>
            <ul>
              {pla.infactibilitats.map((inf, i) => (
                <li key={i}>
                  <strong>{inf.restriccio}:</strong> {inf.detall}
                </li>
              ))}
            </ul>
          </section>
        )}

        {pla?.factible && (
          <>
            <Metriques metriques={pla.metriques} />
            <div className="pestanyes" role="tablist">
              {VISTES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={vista === v.id}
                  onClick={() => setVista(v.id)}
                >
                  {v.nom}
                </button>
              ))}
            </div>
            <Llegenda proves={peticio.proves} />
            {vista === "investigador" ? (
              <VistaInvestigador peticio={peticio} pla={pla} seleccionat={seleccionat} onTriar={obrirItinerari} />
            ) : (
              <VistaPacient peticio={peticio} pla={pla} seleccionat={seleccionat} onTriar={setSeleccionat} />
            )}
          </>
        )}
      </main>
    </>
  );
}
