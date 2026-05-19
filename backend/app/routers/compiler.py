from fastapi import APIRouter
from app.schemas.compiler_schema import CompileRequest
from app.services.compiler_service import compilar_codigo

router = APIRouter(
    prefix="/api",
    tags=["compilador"],
)


@router.post("/compilar")
def compilar(request: CompileRequest):
    """
    Recibe código fuente EduLang y retorna:
    - tokens generados por el léxico
    - salida del programa
    - tabla de símbolos
    - código generado en Python, JavaScript y C#
    - error si existe
    """
    resultado = compilar_codigo(request.codigo)
    return resultado
