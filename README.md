# bitsxlaMarató 2026 – Rutes Sant Pau

Repte de l'Hospital de Sant Pau: planificador de rutes per a participants en estudis i assajos clínics d'Alzheimer i altres malalties neurodegeneratives.

El sistema calcula, a partir de les proves que cal fer a cada participant (PET, RM, punció lumbar, neuropsicologia, analítiques...), el pla de visites que minimitza desplaçaments i esperes respectant totes les restriccions. Si sorgeix un imprevist, replanifica el que queda.

## Objectius

- **Planificació amb restriccions** amb OR-Tools CP-SAT: proves com a intervals, `NoOverlap` per recurs, disponibilitats, precedències amb desfasament mínim/màxim, incompatibilitats, requisits previs (dejuni, analítica recent) i límit de fatiga diària.
- **Multi-pacient**: diversos participants competeixen per recursos compartits (sales, màquines, professionals).
- **Replanificació davant d'imprevistos**: recurs caigut, pacient que cancel·la, prova a repetir. Es fixen les proves ja fetes o confirmades i es penalitzen els canvis respecte al pla anterior.
- **Explicació d'infactibilitats**: indica quina restricció impedeix trobar un pla.
- **Vista equip investigador**: Gantt per recurs i per participant, i diff entre plans.
- **Vista pacient/cuidador**: itinerari per dia amb hora, lloc, durada i què cal portar.
- **Mètriques i comparativa** amb un planificador ingenu de referència.

## Stack

| Capa | Tecnologia |
| --- | --- |
| Motor de planificació | Python + [OR-Tools CP-SAT](https://developers.google.com/optimization) |
| API | FastAPI (`POST /plan`, `POST /replan`) |
| Front | React |
| Configuració de circuits | JSON/YAML |

## Pla de treball

Gestió al Taiga: [taskboard Pre-hackató](https://tree.taiga.io/project/raquelrubiosuarez-bitsxlamarato-2026-rutes-sant-pau/taskboard/pre-hackato). Dos sprints: **Pre-hackató** (preparació) i **Hackató**.

Les històries d'usuari s'agrupen en èpiques:

| Èpica | Contingut |
| --- | --- |
| E0 · Preparació i domini | Fitxa de domini (proves habituals i restriccions típiques), preguntes per als mentors de Sant Pau, repo, entorn Python + OR-Tools i React, CI bàsica |
| E1 · Model de dades i càrrega del dataset | Anàlisi del dataset sintètic, esquema genèric (participant, prova, recurs, disponibilitat, precedència, incompatibilitat, requisit previ), parser amb validació, circuits configurables, generador de casos de prova |
| E2 · Motor de planificació (CP-SAT) | Intervals i `NoOverlap`, disponibilitats, precedències, incompatibilitats i requisits previs, fatiga, funció objectiu amb pesos, multi-pacient, infactibilitats, endpoint `POST /plan` |
| E3 · Replanificació davant d'imprevistos | Fixar proves fetes, estabilitat del pla, esdeveniments d'imprevist, vista diff, endpoint `POST /replan` |
| E4 · Vista equip investigador | Gantt per recurs i per participant |
| E5 · Vista pacient / cuidador | Itinerari per dia |
| E6 · Mètriques i comparativa | Planificador ingenu de referència; KPIs: dies de desplaçament, hores d'espera, dies fins a completar el protocol, ocupació de recursos |

### Pre-hackató (en curs)

- Fitxa de domini de màxim 2 pàgines amb exemples, revisada amb l'equip.
- Llista de preguntes per als mentors de Sant Pau (dia 1).
- Repositori, entorn Python amb OR-Tools (versions fixades), esquelet FastAPI amb endpoint de prova, esquelet React connectat a l'API, CI bàsica (lint i tests).
- Anàlisi del dataset sintètic: camps, volum, nombre de participants, regles implícites i dades incompletes o incoherents.

## Estructura prevista

```
.
├── backend/        # API FastAPI + motor CP-SAT
├── frontend/       # React: vista investigador i vista pacient
├── data/           # dataset sintètic i circuits (JSON/YAML)
└── docs/           # fitxa de domini i documentació
```

L'estructura és orientativa fins que es munti l'esquelet del repo.

## Posada en marxa

Pendent: es documentarà quan estigui l'esquelet (tasca "CI bàsica i README mínim amb com arrencar-ho").

## Equip

- Raquel Rubio
- Manel Alaminos Vazquez
