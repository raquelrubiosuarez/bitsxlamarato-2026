# Pla de la hackató – Rutes Sant Pau

## Objectiu
Planificador de rutes per a participants en assajos clínics d'Alzheimer que minimitza desplaçaments i esperes respectant les restriccions, i replanifica davant d'imprevistos.

## Stack
Python, OR-Tools CP-SAT, FastAPI, React. Detall a [README.md](README.md).

## Funcionalitats
- [ ] Motor de planificació CP-SAT (`POST /plan`)
- [ ] Replanificació davant d'imprevistos (`POST /replan`)
- [ ] Explicació d'infactibilitats
- [ ] Vista equip investigador (Gantt i diff de plans)
- [ ] Vista pacient/cuidador (itinerari per dia)
- [ ] Mètriques i comparativa amb planificador ingenu

## Calendari (48 hores)

### Hores 0-4: Base
- [ ] Esquelet backend i frontend, `docker compose up` funcionant
- [ ] Model de dades i càrrega del dataset

### Hores 4-12: MVP
- [ ] Planificació d'un participant amb restriccions bàsiques
- [ ] Interfície mínima connectada a l'API

### Hores 12-24: Ampliació
- [ ] Multi-pacient i recursos compartits
- [ ] Replanificació
- [ ] Almenys una funcionalitat "wow"

### Hores 24-36: Preparació de la demo
- [ ] Dades de demo
- [ ] Vídeo de reserva de la demo
- [ ] Presentació (màxim 5 diapositives)

### Hores 36-48: Marge i entrega
- [ ] Correcció d'errors
- [ ] Entrega abans del termini

## Funcionalitats "wow"
_(Pendent de pluja d'idees)_

## Notes
_Afegiu notes aquí mentre construïu._
