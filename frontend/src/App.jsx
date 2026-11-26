import { useState } from "react";
import { demanarPla } from "./api.js";
import { PETICIO_EXEMPLE } from "./exemple.js";
import VistaInvestigador from "./components/VistaInvestigador.jsx";
import VistaPacient from "./components/VistaPacient.jsx";
import Metriques from "./components/Metriques.jsx";

export default function App() {
  const [peticio] = useState(PETICIO_EXEMPLE);
  const [pla, setPla] = useState(null);
  const [simulat, setSimulat] = useState(false);
  const [carregant, setCarregant] = useState(false);
  const [vista, setVista] = useState("investigador");

  async function planificar() {
    setCarregant(true);
    const resultat = await demanarPla(peticio);
    setPla(resultat.pla);
    setSimulat(resultat.simulat);
    setCarregant(false);
  }

  return (
    <div className="app">
      <header className="capcalera">
        <h1>Rutes Sant Pau</h1>
        <p>Planificador de visites per a estudis i assajos clínics</p>
      </header>

      <section className="barra">
        <span>
          {peticio.participants.length} participants · {peticio.proves.length} proves ·{" "}
          {peticio.recursos.length} recursos · {peticio.horitzo_dies} dies
        </span>
        <button onClick={planificar} disabled={carregant}>
          {carregant ? "Planificant…" : "Planificar"}
        </button>
      </section>

      {simulat && (
        <p className="avis" role="status">
          L'API no respon: es mostra un pla d'exemple.
        </p>
      )}

      {pla && !pla.factible && (
        <section className="avis" role="alert">
          <h2>No hi ha cap pla possible</h2>
          <ul>
            {pla.infactibilitats.map((inf, i) => (
              <li key={i}>
                <strong>{inf.restriccio}</strong>: {inf.detall}
              </li>
            ))}
          </ul>
        </section>
      )}

      {pla?.factible && (
        <>
          <Metriques metriques={pla.metriques} />
          <nav className="pestanyes">
            <button aria-pressed={vista === "investigador"} onClick={() => setVista("investigador")}>
              Equip investigador
            </button>
            <button aria-pressed={vista === "pacient"} onClick={() => setVista("pacient")}>
              Pacient / cuidador
            </button>
          </nav>
          {vista === "investigador" ? (
            <VistaInvestigador peticio={peticio} pla={pla} />
          ) : (
            <VistaPacient peticio={peticio} pla={pla} />
          )}
        </>
      )}
    </div>
  );
}
