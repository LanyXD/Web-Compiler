from pydantic import BaseModel
from typing import Optional


# ── REQUEST ──────────────────────────────────────────────────────────────────

class CompileRequest(BaseModel):
    codigo: str


# ── RESPONSE PIECES ───────────────────────────────────────────────────────────

class Token(BaseModel):
    tipo: str
    valor: str
    linea: int


class Simbolo(BaseModel):
    nombre: str
    tipo: str
    valor: str
    linea: int
    scope: str


class CodigoGenerado(BaseModel):
    python: str
    javascript: str
    csharp: str


class ErrorCompilador(BaseModel):
    linea: int
    error: str
    detalle: str
    solucion: str


# ── RESPONSE PRINCIPAL ────────────────────────────────────────────────────────

class CompileResponse(BaseModel):
    exito: bool
    tokens: list[Token]
    salida: list[str]
    simbolos: list[Simbolo]
    generado: CodigoGenerado
    error: Optional[ErrorCompilador] = None
    