import sys
import os

COMPILER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'compiler'))
sys.path.insert(0, COMPILER)

from models.lexico_model import Lexer
from models.sintactico_model import Parser
from models.semantico_model import AnalizadorSemantico
from models.error import CompilerError
from generators.python_generator import PythonGenerator
from generators.javascript_generator import JavaScriptGenerator
from generators.csharp_generator import CSharpGenerator

from app.schemas.compiler_schema import (
    CompileResponse, Token, Simbolo, CodigoGenerado, ErrorCompilador
)


def _ast_to_dict(nodo):
    """Convierte el AST a un diccionario serializable."""
    if nodo is None:
        return None
    if isinstance(nodo, list):
        return [_ast_to_dict(n) for n in nodo]
    if isinstance(nodo, (int, float, str, bool)):
        return nodo

    resultado = {"tipo": type(nodo).__name__}
    for attr, val in vars(nodo).items():
        if isinstance(val, list):
            resultado[attr] = [_ast_to_dict(v) for v in val]
        elif hasattr(val, "__dict__"):
            resultado[attr] = _ast_to_dict(val)
        else:
            resultado[attr] = val

    return resultado


def compilar_codigo(codigo: str) -> dict:
    """
    Recibe código fuente, lo pasa por las fases del compilador
    y retorna un diccionario con todos los resultados.
    """

    if not codigo.strip():
        return {
            "exito": False,
            "tokens": [],
            "salida": [],
            "simbolos": [],
            "generado": {"python": "", "javascript": "", "csharp": ""},
            "error": {
                "linea": 0,
                "error": "Código vacío",
                "detalle": "No hay código para compilar",
                "solucion": "Escribe algo en el editor",
            },
        }

    try:
        # ── FASE 1: LÉXICO ────────────────────────────────────────────────────
        lexer = Lexer(codigo)
        tokens, errores_lex = lexer.analizar_con_errores()

        if errores_lex:
            e = errores_lex[0]
            return _error_response(e)

        tokens_json = [
            {"tipo": t.tipo, "valor": t.valor, "linea": t.linea}
            for t in tokens
        ]

        # ── FASE 2: SINTÁCTICO ────────────────────────────────────────────────
        parser = Parser(tokens)
        ast = parser.parse()

        # ── FASE 3: SEMÁNTICO ─────────────────────────────────────────────────
        semantic = AnalizadorSemantico()
        semantic.analizar(ast)

        salida = [str(x) for x in semantic.salida] if semantic.salida else []

        # ── TABLA DE SÍMBOLOS ─────────────────────────────────────────────────
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

        # ── GENERACIÓN DE CÓDIGO ──────────────────────────────────────────────
        py_gen = PythonGenerator()
        py_gen.generate(ast)

        js_gen = JavaScriptGenerator()
        js_gen.generate(ast)

        cs_gen = CSharpGenerator()
        cs_gen.generate(ast)

        return {
            "exito": True,
            "tokens": tokens_json,
            "salida": salida,
            "simbolos": simbolos,
            "generado": {
                "python": py_gen.get_code(),
                "javascript": js_gen.get_code(),
                "csharp": cs_gen.get_code(),
            },
            "error": None,
        }

    except CompilerError as e:
        return _error_response({
            "linea": e.linea,
            "error": "Error de compilación",
            "detalle": e.mensaje,
            "solucion": "Revisa la sintaxis del código",
        })

    except Exception as e:
        return _error_response({
            "linea": 0,
            "error": "Error interno",
            "detalle": str(e),
            "solucion": "Error inesperado del compilador",
        })


def _error_response(e: dict) -> dict:
    return {
        "exito": False,
        "tokens": [],
        "salida": [],
        "simbolos": [],
        "generado": {"python": "", "javascript": "", "csharp": ""},
        "error": e,
    }
