// "09:30" -> 570
export function aMinuts(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// 570 -> "09:30"
export function aHora(minuts) {
  return `${String(Math.floor(minuts / 60)).padStart(2, "0")}:${String(minuts % 60).padStart(2, "0")}`;
}

export function dies(horitzo) {
  return Array.from({ length: horitzo }, (_, i) => i);
}

// 45 -> "45 min", 90 -> "1 h 30 min"
export function durada(minuts) {
  const h = Math.floor(minuts / 60);
  const m = minuts % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

// "Pavelló de Sant Rafael, planta -1" -> "Pavelló de Sant Rafael"
export function pavello(ubicacio) {
  return ubicacio?.split(",")[0].trim() ?? "";
}
