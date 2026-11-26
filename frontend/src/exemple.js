// Dades d'exemple amb el format de l'esquema intern (backend/app/esquema.py).
// Són sintètiques: serveixen per treballar la interfície sense l'API ni el dataset.
// `categoria` és només per al frontend (color del filet de la rajola).

import { aHora } from "./temps.js";

const participants = Array.from({ length: 12 }, (_, i) => {
  const id = `P${String(i + 1).padStart(3, "0")}`;
  return { id, nom: `Participant ${id.slice(1)}`, proves: ["ANA", "RM", "PET", "PL", "NPS"], max_min_per_dia: 240 };
});

export const PETICIO_EXEMPLE = {
  horitzo_dies: 5,
  recursos: [
    { id: "pet1", nom: "PET-TC", tipus: "maquina", ubicacio: "Pavelló de Sant Rafael, planta -1" },
    { id: "rm1", nom: "RM 3T", tipus: "maquina", ubicacio: "Pavelló de Sant Rafael, planta -1" },
    { id: "inf1", nom: "Infermeria 1", tipus: "professional", ubicacio: "Hospital de dia, planta 0" },
    { id: "inf2", nom: "Infermeria 2", tipus: "professional", ubicacio: "Hospital de dia, planta 0" },
    { id: "neuro1", nom: "Neuropsicologia 1", tipus: "professional", ubicacio: "Pavelló de la Mercè, planta 1" },
    { id: "neuro2", nom: "Neuropsicologia 2", tipus: "professional", ubicacio: "Pavelló de la Mercè, planta 1" },
  ],
  proves: [
    { id: "ANA", nom: "Analítica", categoria: "extraccio", durada_min: 15, recursos: [["inf1", "inf2"]], dejuni: true, portar: ["Targeta sanitària"] },
    { id: "RM", nom: "RM cerebral", categoria: "imatge", durada_min: 45, recursos: [["rm1"]], portar: ["Res metàl·lic: rellotge, anells, cinturó"] },
    { id: "PET", nom: "PET amiloide", categoria: "imatge", durada_min: 90, recursos: [["pet1"]], dejuni: true, portar: ["Acompanyant"] },
    { id: "PL", nom: "Punció lumbar", categoria: "extraccio", durada_min: 60, recursos: [["inf1", "inf2"]], portar: ["Acompanyant", "Roba còmoda"] },
    { id: "NPS", nom: "Avaluació neuropsicològica", categoria: "avaluacio", durada_min: 120, recursos: [["neuro1", "neuro2"]], portar: ["Ulleres i audiòfons, si en fa servir"] },
  ],
  participants,
  precedencies: [{ abans: "ANA", despres: "PL", max_desfasament_min: 10080, motiu: "Analítica recent" }],
  incompatibilitats: [{ prova_a: "PET", prova_b: "NPS", min_separacio_min: 1440, motiu: "Fatiga" }],
};

// Planificador voraç de demostració: col·loca cada prova al primer forat lliure.
// No optimitza res; només genera un pla versemblant mentre no hi ha API.
const INICI = 8 * 60;
const FI = 16 * 60;
const PAS = 15;
const MARGE = 15; // entre dues proves del mateix participant

function generarPla(peticio) {
  const proves = Object.fromEntries(peticio.proves.map((p) => [p.id, p]));
  const ocupat = {}; // `${recurs}:${dia}` -> [[inici, fi]]
  const lliure = (clau, i, f) => !(ocupat[clau] ?? []).some(([a, b]) => i < b && a < f);
  const assignacions = [];

  peticio.participants.forEach((participant, n) => {
    const fetes = {}; // prova -> { dia, inici, fi }
    const diaInicial = n % 3;
    for (const idProva of participant.proves) {
      const prova = proves[idProva];
      const dur = prova.durada_min;
      let posada = false;
      for (let dia = diaInicial; dia < peticio.horitzo_dies && !posada; dia++) {
        const delDia = Object.values(fetes).filter((f) => f.dia === dia);
        const minuts = delDia.reduce((s, f) => s + (f.fi - f.inici), 0);
        if (minuts + dur > (participant.max_min_per_dia ?? Infinity)) continue;
        const incompatible = peticio.incompatibilitats.some((inc) => {
          const altra = inc.prova_a === idProva ? inc.prova_b : inc.prova_b === idProva ? inc.prova_a : null;
          return altra && fetes[altra]?.dia === dia;
        });
        if (incompatible) continue;
        for (let t = INICI; t + dur <= FI && !posada; t += PAS) {
          const precedenciaOk = peticio.precedencies.every((pc) => {
            if (pc.despres !== idProva || !fetes[pc.abans]) return true;
            const abans = fetes[pc.abans];
            const desfas = dia * 1440 + t - (abans.dia * 1440 + abans.fi);
            return desfas >= (pc.min_desfasament_min ?? 0) && (pc.max_desfasament_min == null || desfas <= pc.max_desfasament_min);
          });
          if (!precedenciaOk) continue;
          if (delDia.some((f) => t < f.fi + MARGE && f.inici < t + dur + MARGE)) continue;
          const triats = prova.recursos.map((alternatives) => alternatives.find((r) => lliure(`${r}:${dia}`, t, t + dur)));
          if (triats.some((r) => !r)) continue;
          triats.forEach((r) => (ocupat[`${r}:${dia}`] ??= []).push([t, t + dur]));
          fetes[idProva] = { dia, inici: t, fi: t + dur };
          assignacions.push({
            participant_id: participant.id,
            prova_id: idProva,
            recursos: triats,
            dia,
            inici: aHora(t),
            fi: aHora(t + dur),
            estat: dia === 0 ? "feta" : dia === 1 ? "confirmada" : "planificada",
          });
          posada = true;
        }
      }
    }
  });

  return { factible: true, assignacions, infactibilitats: [], metriques: calcularMetriques(peticio, assignacions) };
}

function calcularMetriques(peticio, assignacions) {
  const min = (h) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
  let dies = 0;
  let espera = 0;
  let ultimDia = 0;
  for (const p of peticio.participants) {
    const seves = assignacions.filter((a) => a.participant_id === p.id);
    const perDia = Object.groupBy(seves, (a) => a.dia);
    dies += Object.keys(perDia).length;
    for (const visites of Object.values(perDia)) {
      visites.sort((x, y) => min(x.inici) - min(y.inici));
      for (let i = 1; i < visites.length; i++) espera += min(visites[i].inici) - min(visites[i - 1].fi);
    }
    ultimDia = Math.max(ultimDia, ...seves.map((a) => a.dia));
  }
  const ocupats = assignacions.reduce((s, a) => s + (min(a.fi) - min(a.inici)) * a.recursos.length, 0);
  return {
    dies_desplacament: dies,
    hores_espera: Math.round((espera / 60) * 10) / 10,
    dies_fins_completar: ultimDia + 1,
    ocupacio_recursos: ocupats / (peticio.recursos.length * peticio.horitzo_dies * (FI - INICI)),
  };
}

export const PLA_EXEMPLE = generarPla(PETICIO_EXEMPLE);
