// "09:30" -> 570
export function aMinuts(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

export function dies(horitzo) {
  return Array.from({ length: horitzo }, (_, i) => i);
}
