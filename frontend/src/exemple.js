// Dades d'exemple amb el format de l'esquema intern (backend/app/esquema.py).
// Són sintètiques: serveixen per treballar la interfície sense l'API ni el dataset.

export const PETICIO_EXEMPLE = {
  horitzo_dies: 5,
  recursos: [
    { id: "pet1", nom: "PET-TC", tipus: "maquina", ubicacio: "Pavelló Sant Rafael, planta -1" },
    { id: "rm1", nom: "RM 3T", tipus: "maquina", ubicacio: "Pavelló Sant Rafael, planta -1" },
    { id: "inf1", nom: "Infermeria", tipus: "professional", ubicacio: "Hospital de dia, planta 0" },
    { id: "neuro1", nom: "Neuropsicologia", tipus: "professional", ubicacio: "Unitat de Memòria, planta 1" },
  ],
  proves: [
    { id: "ANA", nom: "Analítica", durada_min: 15, recursos: [["inf1"]], dejuni: true, portar: ["Targeta sanitària"] },
    { id: "RM", nom: "RM cerebral", durada_min: 45, recursos: [["rm1"]], portar: ["Treure's objectes metàl·lics"] },
    { id: "PET", nom: "PET amiloide", durada_min: 90, recursos: [["pet1"]], dejuni: true, portar: ["Acompanyant"] },
    { id: "PL", nom: "Punció lumbar", durada_min: 60, recursos: [["inf1"]], portar: ["Acompanyant", "Roba còmoda"] },
    { id: "NPS", nom: "Avaluació neuropsicològica", durada_min: 120, recursos: [["neuro1"]], portar: ["Ulleres i audiòfons si en fa servir"] },
  ],
  participants: [
    { id: "P001", nom: "Participant 001", proves: ["ANA", "RM", "PET", "PL", "NPS"], max_min_per_dia: 240 },
    { id: "P002", nom: "Participant 002", proves: ["ANA", "RM", "PET", "PL", "NPS"], max_min_per_dia: 240 },
  ],
  precedencies: [{ abans: "ANA", despres: "PL", max_desfasament_min: 10080, motiu: "Analítica recent" }],
  incompatibilitats: [{ prova_a: "PET", prova_b: "NPS", min_separacio_min: 1440, motiu: "Fatiga" }],
};

const a = (participant_id, prova_id, recursos, dia, inici, fi, estat = "planificada") => ({
  participant_id, prova_id, recursos, dia, inici, fi, estat,
});

export const PLA_EXEMPLE = {
  factible: true,
  assignacions: [
    a("P001", "ANA", ["inf1"], 0, "08:00", "08:15", "feta"),
    a("P001", "RM", ["rm1"], 0, "09:00", "09:45", "confirmada"),
    a("P001", "NPS", ["neuro1"], 0, "10:30", "12:30", "confirmada"),
    a("P001", "PET", ["pet1"], 2, "09:00", "10:30"),
    a("P001", "PL", ["inf1"], 2, "11:00", "12:00"),
    a("P002", "ANA", ["inf1"], 0, "08:15", "08:30", "feta"),
    a("P002", "PET", ["pet1"], 0, "09:00", "10:30", "confirmada"),
    a("P002", "RM", ["rm1"], 1, "08:30", "09:15"),
    a("P002", "NPS", ["neuro1"], 1, "09:30", "11:30"),
    a("P002", "PL", ["inf1"], 1, "12:00", "13:00"),
  ],
  infactibilitats: [],
  metriques: { dies_desplacament: 4, hores_espera: 2.5, dies_fins_completar: 3, ocupacio_recursos: 0.31 },
};
