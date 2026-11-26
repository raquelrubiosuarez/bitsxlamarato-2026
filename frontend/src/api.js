import { PLA_EXEMPLE } from "./exemple.js";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// Demana un pla a POST /plan. Si l'API encara no existeix o falla,
// torna el pla d'exemple perquè la interfície es pugui treballar igualment.
export async function demanarPla(peticio) {
  try {
    const resposta = await fetch(`${API_URL}/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(peticio),
    });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    return { pla: await resposta.json(), simulat: false };
  } catch (error) {
    return { pla: PLA_EXEMPLE, simulat: true, error: String(error) };
  }
}
