---
title: "Sessió 2026-11-26: posada en marxa del repo i primer frontend"
date: 2026-11-26
tags: [sessio, pre-hackato]
participants: [Raquel]
---

# Sessió 2026-11-26: posada en marxa del repo i primer frontend

## Objectiu

Deixar el repo a punt per treballar en equip i tenir una primera interfície que es pugui ensenyar sense el dataset.

## Fet

- **Repo** ([PR #1](https://github.com/raquelrubiosuarez/bitsxlamarato-2026/pull/1)): `.gitignore` per a Python i Node, `.gitattributes`, `.env.example`, `docker-compose.yml`, `HACKATHON_PLAN.md`, carpetes `backend/`, `frontend/`, `data/` i `docs/`, i regles de hackathon-mode a `.hackathon-rules.md`.
- **Esquema intern** ([PR #2](https://github.com/raquelrubiosuarez/bitsxlamarato-2026/pull/2)): models Pydantic a `backend/app/esquema.py` per a `/plan` i `/replan`, amb validació de referències.
- **Frontend** ([PR #3](https://github.com/raquelrubiosuarez/bitsxlamarato-2026/pull/3)): React 19 + Vite 8 amb l'estil "modernisme clínic". Vista investigador (protocol i ocupació de recursos en franges de 15 minuts) i vista pacient (itinerari entre pavellons). Si l'API no respon, fa servir un pla d'exemple generat al navegador.
- **Taiga**: tancades les tasques #66 i #74; #16, #34 i #39 a "Ready for test"; #35 i #45 a "In progress"; creada la #78.

## Decisions

- **Flux de git**: `develop` només accepta canvis per PR, amb 0 aprovacions perquè de moment només hi treballa la Raquel. Les branques es diuen `feature/*`, com al repo perseida; GitHub no ho pot imposar en un repo personal gratuït, així que és només una convenció.
- **Commits i PR** en català, sense línies d'atribució.
- **Dades**: el motor treballa només amb l'esquema intern. El dataset de Sant Pau arriba el dia 1 i s'hi adaptarà amb un loader.
- **Estil visual**: normes `Estil ·` a `.hackathon-rules.md` (paleta de 7 colors, Fraunces, Atkinson Hyperlegible, IBM Plex Mono, la rajola com a component base).
- `Estat.jsx` es va reanomenar a `EstatProva.jsx` perquè el navegador en bloquejava la càrrega (probablement un bloquejador d'anuncis).

## Pendent

- [ ] Esquelet de FastAPI amb `POST /plan` (TG-28) i OR-Tools a `requirements.txt` (TG-13).
- [ ] CI bàsica: lint i tests (TG-13).
- [ ] Generador de dades sintètiques en Python amb llavor fixa i casos límit (TG-73).
- [ ] Camp `categoria` a `Prova` al backend (TG-78).
- [ ] Revisar el frontend en mòbil.
- [ ] Convidar Manel al repo de GitHub amb permís d'escriptura.
- [ ] Treure el bloqueig de TG-16 al Taiga, que ja està feta.
- [ ] Pujar la branca `feature/estil-visual` (regles d'estil), que encara és només local.

## Bloquejos i preguntes

- Falta el dataset real fins al dia 1: cal preparar les preguntes per als mentors (TG-12).

Related: [plantilla de sessió](../plantilles/sessio.md)
