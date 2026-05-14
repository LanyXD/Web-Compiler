import sys
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
COMPILADOR = os.path.join(ROOT, 'Compilador')

sys.path.insert(0, ROOT)
sys.path.insert(0, COMPILADOR)  # ← esto permite que "from models.x import" funcione

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.lexico_model import Lexer
from models.sintactico_model import Parser
from models.semantico_model import AnalizadorSemantico
from models.error import CompilerError
from generators.python_generator import PythonGenerator
from generators.javascript_generator import JavaScriptGenerator
from generators.csharp_generator import CSharpGenerator

app = FastAPI(title="EduLang Compiler API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodigoRequest(BaseModel):
    codigo: str


def ast_to_dict(nodo):
    if nodo is None:
        return None
    if isinstance(nodo, list):
        return [ast_to_dict(n) for n in nodo]
    if isinstance(nodo, (int, float, str, bool)):
        return nodo

    tipo = type(nodo).__name__
    resultado = {"tipo": tipo}

    for attr, val in vars(nodo).items():
        if attr == "linea":
            resultado["linea"] = val
        elif isinstance(val, list):
            resultado[attr] = [ast_to_dict(v) for v in val]
        elif hasattr(val, "__dict__") or hasattr(val, "tipo"):
            resultado[attr] = ast_to_dict(val)
        else:
            resultado[attr] = val

    return resultado


@app.post("/compilar")
def compilar(req: CodigoRequest):
    codigo = req.codigo

    if not codigo.strip():
        return {"error": {"linea": 0, "error": "Código vacío", "detalle": "No hay código para compilar", "solucion": "Escribe algo"}}

    try:
        # ── LÉXICO ──
        lexer = Lexer(codigo)
        tokens, errores_lex = lexer.analizar_con_errores()

        if errores_lex:
            return {"error": errores_lex[0]}

        tokens_json = [{"tipo": t.tipo, "valor": t.valor, "linea": t.linea} for t in tokens]

        # ── SINTÁCTICO ──
        parser = Parser(tokens)
        ast = parser.parse()
        ast_json = ast_to_dict(ast)

        # ── SEMÁNTICO ──
        semantic = AnalizadorSemantico()
        semantic.analizar(ast)

        salida = [str(x) for x in semantic.salida] if semantic.salida else []

        # ── TABLA DE SÍMBOLOS ──
        simbolos = []
        if hasattr(semantic, "scopes") and semantic.scopes:
            for nombre, sym in semantic.scopes[0].items():
                simbolos.append({
                    "nombre": sym.nombre,
                    "tipo": sym.tipo,
                    "valor": str(sym.valor),
                    "linea": sym.linea,
                    "scope": sym.scope,
                })

        # ── TRAZA ──
        traza = []
        if hasattr(parser, "traza"):
            traza.extend(parser.traza)
        if hasattr(semantic, "traza"):
            traza.extend(semantic.traza)

        # ── GENERADORES ──
        py_gen = PythonGenerator()
        py_gen.generate(ast)
        codigo_python = py_gen.get_code()

        js_gen = JavaScriptGenerator()
        js_gen.generate(ast)
        codigo_js = js_gen.get_code()

        cs_gen = CSharpGenerator()
        cs_gen.generate(ast)
        codigo_cs = cs_gen.get_code()

        return {
            "exito": True,
            "tokens": tokens_json,
            "ast": ast_json,
            "salida": salida,
            "simbolos": simbolos,
            "traza": traza,
            "generado": {
                "python": codigo_python,
                "javascript": codigo_js,
                "csharp": codigo_cs,
            }
        }

    except CompilerError as e:
        return {"error": {
            "linea": e.linea,
            "error": "Error de compilación",
            "detalle": e.mensaje,
            "solucion": "Revisa la sintaxis o semántica del código",
        }}

    except Exception as e:
        return {"error": {
            "linea": 0,
            "error": "Error interno",
            "detalle": str(e),
            "solucion": "Error inesperado del compilador",
        }}


@app.get("/")
def root():
    return {"mensaje": "EduLang Compiler API activa"}
