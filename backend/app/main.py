from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import compiler

app = FastAPI(
    title="Compilador NPC AAA",
    description="API del compilador de lenguaje para NPCs",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción cambiar por la URL de Vercel
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compiler.router)


@app.get("/")
def root():
    return {"mensaje": "API del Compilador NPC AAA activa"}
