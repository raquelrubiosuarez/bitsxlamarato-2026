"""Esquema intern del planificador.

El motor CP-SAT i l'API només treballen amb aquests models. El dataset de
Sant Pau s'hi traduirà amb un adaptador (loader) quan el tinguem.

Unitats: els temps són minuts. Els dies són índexs a partir de 0 dins de
l'horitzó de planificació; les hores són hores del dia ("09:30").
"""

from datetime import time
from enum import Enum

from pydantic import BaseModel, Field, model_validator


class Finestra(BaseModel):
    """Franja en què un recurs o un participant està disponible."""

    dia: int = Field(ge=0)
    inici: time
    fi: time

    @model_validator(mode="after")
    def _ordre(self):
        if self.fi <= self.inici:
            raise ValueError(f"la finestra del dia {self.dia} acaba abans de començar")
        return self


class TipusRecurs(str, Enum):
    sala = "sala"
    maquina = "maquina"
    professional = "professional"


class Recurs(BaseModel):
    id: str
    nom: str
    tipus: TipusRecurs
    ubicacio: str | None = None
    disponibilitat: list[Finestra] = []


class Prova(BaseModel):
    """Tipus de prova del protocol (PET, RM, punció lumbar...)."""

    id: str
    nom: str
    durada_min: int = Field(gt=0)
    # Calen tots alhora. Per a cada posició, qualsevol dels ids de la llista serveix.
    recursos: list[list[str]] = []
    dejuni: bool = False
    portar: list[str] = []
    instruccions: str | None = None


class Precedencia(BaseModel):
    """`despres` ha de començar entre min i max minuts després que acabi `abans`."""

    abans: str
    despres: str
    min_desfasament_min: int = Field(default=0, ge=0)
    max_desfasament_min: int | None = Field(default=None, ge=0)
    motiu: str | None = None

    @model_validator(mode="after")
    def _rang(self):
        if self.max_desfasament_min is not None and self.max_desfasament_min < self.min_desfasament_min:
            raise ValueError(f"precedència {self.abans}->{self.despres}: max < min")
        return self


class Incompatibilitat(BaseModel):
    """Dues proves que han d'estar separades com a mínim `min_separacio_min`."""

    prova_a: str
    prova_b: str
    min_separacio_min: int = Field(default=1440, ge=0)
    motiu: str | None = None


class Participant(BaseModel):
    id: str
    nom: str | None = None
    proves: list[str]
    disponibilitat: list[Finestra] = []
    max_min_per_dia: int | None = Field(default=None, gt=0)  # límit de fatiga
    max_proves_per_dia: int | None = Field(default=None, gt=0)
    prioritat: int = 1


class Pesos(BaseModel):
    """Pesos de la funció objectiu. Configurables per ajustar-los amb els mentors."""

    dies_desplacament: int = 100
    espera_min: int = 1
    dies_fins_completar: int = 10
    canvis_respecte_pla_anterior: int = 50


class EstatAssignacio(str, Enum):
    planificada = "planificada"
    confirmada = "confirmada"
    feta = "feta"


class Assignacio(BaseModel):
    participant_id: str
    prova_id: str
    recursos: list[str]
    dia: int = Field(ge=0)
    inici: time
    fi: time
    estat: EstatAssignacio = EstatAssignacio.planificada


class Infactibilitat(BaseModel):
    restriccio: str
    detall: str
    participant_id: str | None = None
    prova_id: str | None = None


class Pla(BaseModel):
    factible: bool
    assignacions: list[Assignacio] = []
    infactibilitats: list[Infactibilitat] = []
    metriques: dict[str, float] = {}


class TipusImprevist(str, Enum):
    recurs_caigut = "recurs_caigut"
    cancelacio_participant = "cancelacio_participant"
    repetir_prova = "repetir_prova"


class Imprevist(BaseModel):
    tipus: TipusImprevist
    recurs_id: str | None = None
    participant_id: str | None = None
    prova_id: str | None = None
    dies: list[int] = []  # dies afectats (recurs caigut / participant no disponible)

    @model_validator(mode="after")
    def _camps(self):
        requerit = {
            TipusImprevist.recurs_caigut: "recurs_id",
            TipusImprevist.cancelacio_participant: "participant_id",
            TipusImprevist.repetir_prova: "prova_id",
        }[self.tipus]
        if getattr(self, requerit) is None:
            raise ValueError(f"l'imprevist {self.tipus.value} necessita {requerit}")
        if self.tipus == TipusImprevist.repetir_prova and self.participant_id is None:
            raise ValueError("l'imprevist repetir_prova necessita participant_id")
        return self


class PeticioPlan(BaseModel):
    """Entrada de POST /plan."""

    horitzo_dies: int = Field(gt=0)
    recursos: list[Recurs]
    proves: list[Prova]
    participants: list[Participant]
    precedencies: list[Precedencia] = []
    incompatibilitats: list[Incompatibilitat] = []
    pesos: Pesos = Pesos()

    @model_validator(mode="after")
    def _referencies(self):
        errors: list[str] = []
        recursos = {r.id for r in self.recursos}
        proves = {p.id for p in self.proves}

        for nom, ids in (("recurs", [r.id for r in self.recursos]), ("prova", [p.id for p in self.proves]),
                         ("participant", [p.id for p in self.participants])):
            repetits = {i for i in ids if ids.count(i) > 1}
            if repetits:
                errors.append(f"{nom} amb id repetit: {sorted(repetits)}")

        for p in self.proves:
            for alternatives in p.recursos:
                if not alternatives:
                    errors.append(f"prova {p.id}: posició de recurs buida")
                for r in alternatives:
                    if r not in recursos:
                        errors.append(f"prova {p.id}: recurs desconegut {r}")
        for pa in self.participants:
            for pr in pa.proves:
                if pr not in proves:
                    errors.append(f"participant {pa.id}: prova desconeguda {pr}")
        for pc in self.precedencies:
            for pr in (pc.abans, pc.despres):
                if pr not in proves:
                    errors.append(f"precedència {pc.abans}->{pc.despres}: prova desconeguda {pr}")
        for inc in self.incompatibilitats:
            for pr in (inc.prova_a, inc.prova_b):
                if pr not in proves:
                    errors.append(f"incompatibilitat {inc.prova_a}/{inc.prova_b}: prova desconeguda {pr}")

        finestres = [f for r in self.recursos for f in r.disponibilitat]
        finestres += [f for p in self.participants for f in p.disponibilitat]
        for f in finestres:
            if f.dia >= self.horitzo_dies:
                errors.append(f"finestra al dia {f.dia} fora de l'horitzó ({self.horitzo_dies} dies)")

        if errors:
            raise ValueError("; ".join(errors))
        return self


class PeticioReplan(BaseModel):
    """Entrada de POST /replan: el problema original, el pla vigent i què ha passat."""

    peticio: PeticioPlan
    pla_anterior: Pla
    imprevistos: list[Imprevist] = []
    dia_actual: int = Field(default=0, ge=0)
