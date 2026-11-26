import Rajola from "./Rajola.jsx";
import { ESTATS } from "./EstatProva.jsx";

const CATEGORIES = { imatge: "Imatge", extraccio: "Extracció", avaluacio: "Avaluació" };

export default function Llegenda({ proves }) {
  return (
    <div className="llegenda" aria-label="Llegenda">
      <ul>
        {Object.entries(CATEGORIES).map(([cat, nom]) => (
          <li key={cat}>
            <Rajola prova={{ id: "", categoria: cat }} estat="confirmada" titol={nom} />
            <span>
              {nom}{" "}
              <span className="mono">
                ({proves.filter((p) => p.categoria === cat).map((p) => p.id).join(", ")})
              </span>
            </span>
          </li>
        ))}
      </ul>
      <ul>
        {Object.entries(ESTATS).map(([estat, nom]) => (
          <li key={estat}>
            <Rajola prova={{ id: "", categoria: "altres" }} estat={estat} titol={nom} />
            {nom}
          </li>
        ))}
      </ul>
    </div>
  );
}
