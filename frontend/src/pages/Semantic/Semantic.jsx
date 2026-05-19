import './Semantic.css'

const TYPE_MAP = [
  { edulang: 'entero',   python: 'int',   desc: 'Número entero sin parte decimal' },
  { edulang: 'decimal',  python: 'float', desc: 'Número con parte decimal' },
  { edulang: 'texto',    python: 'str',   desc: 'Cadena de caracteres' },
  { edulang: 'booleano', python: 'bool',  desc: 'Valor verdadero o falso' },
  { edulang: 'lista',    python: 'list',  desc: 'Colección ordenada de valores' },
]

const SEMANTIC_CHECKS = [
  {
    nombre: 'Variable definida',
    codigo: 'escribir(vida)',
    ok: false,
    desc: 'Si "vida" nunca fue asignada, el analizador lanza: Variable no definida: vida',
  },
  {
    nombre: 'Compatibilidad de tipo',
    codigo: 'entero x = "texto"',
    ok: false,
    desc: 'El valor "texto" es str pero se declaró entero — Se esperaba tipo "entero" pero se recibió "str"',
  },
  {
    nombre: 'Tipos en operación',
    codigo: 'vida + nombre',
    ok: false,
    desc: 'Sumar int y str es inválido — Tipos incompatibles: int y str',
  },
  {
    nombre: 'Función definida',
    codigo: 'atacar(100)',
    ok: false,
    desc: 'Si "atacar" no fue declarada: Función no definida: atacar',
  },
  {
    nombre: 'Aridad correcta',
    codigo: 'saludar(a, b, c)',
    ok: false,
    desc: 'Si saludar espera 1 parámetro: La función "saludar" espera 1 argumento',
  },
  {
    nombre: 'División por cero',
    codigo: 'resultado = vida / 0',
    ok: false,
    desc: 'Detectado en evaluación semántica: División entre cero',
  },
  {
    nombre: 'Bucle sin fin',
    codigo: 'mientras verdadero:\n    x = 1',
    ok: false,
    desc: 'El analizador limita a 100 000 iteraciones: Bucle infinito detectado',
  },
]

const SCOPE_EXAMPLE = `vida = 100
nombre = "Guardia"

funcion saludar(n):
    mensaje = "Hola " + n
    retornar mensaje

saludar(nombre)`

const SEM_TRACE = [
  { linea: 1, accion: 'Asignación "vida"',     valor: '100' },
  { linea: 2, accion: 'Asignación "nombre"',   valor: '"Guardia"' },
  { linea: 4, accion: 'Definición "saludar"',  valor: '<func>' },
  { linea: 8, accion: 'Llamada "saludar"',     valor: '—' },
  { linea: 4, accion: 'Nuevo scope local',      valor: 'n = "Guardia"' },
  { linea: 5, accion: 'Asignación "mensaje"',  valor: '"Hola Guardia"' },
  { linea: 6, accion: 'Retornar',              valor: '"Hola Guardia"' },
  { linea: 8, accion: 'Scope local destruido', valor: '—' },
]

const SEM_ERRORS = [
  {
    tipo: 'Variable no definida',
    ejemplo: 'escribir(puntaje)',
    detalle: 'Se usó "puntaje" antes de asignarle un valor',
    solucion: 'Declarar la variable antes de usarla: puntaje = 0',
  },
  {
    tipo: 'Tipo incompatible',
    ejemplo: 'entero nivel = "cinco"',
    detalle: 'Se declaró tipo entero pero el valor asignado es de tipo str',
    solucion: 'Asignar un valor numérico: entero nivel = 5',
  },
  {
    tipo: 'Función no definida',
    ejemplo: 'resultado = calcular(10)',
    detalle: 'La función "calcular" no fue declarada antes de ser invocada',
    solucion: 'Definir la función con "funcion calcular(...):" antes de llamarla',
  },
  {
    tipo: 'División entre cero',
    ejemplo: 'ratio = total / 0',
    detalle: 'El divisor evaluó a cero en tiempo de análisis semántico',
    solucion: 'Verificar que el divisor no sea cero antes de dividir',
  },
]

export default function Semantic() {
  return (
    <div className="page">
      <div className="container">

        <section className="section">
          <h2 className="section-title">Fase 3 — Análisis Semántico</h2>
          <p className="section-subtitle">Verificación de significado y ejecución simbólica del AST</p>
          <p>
            El analizador semántico recorre el AST producido por el parser y verifica que las
            operaciones sean <strong>significativamente correctas</strong>: las variables deben
            existir antes de usarse, los tipos deben ser compatibles y las funciones deben estar
            declaradas antes de invocarse.
          </p>
          <p>
            Además de las verificaciones estáticas, este analizador <strong>ejecuta el programa
            simbólicamente</strong> — evalúa expresiones, gestiona el alcance de variables y
            produce la salida del programa. Cada operación válida genera una entrada en la{' '}
            <em>traza semántica</em> que permite inspeccionar el estado interno línea a línea.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Sistema de tipos</h2>
          <p className="section-subtitle">Correspondencia entre los tipos del lenguaje y los tipos Python internos</p>

          <div className="sem-type-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tipo EduLang</th>
                  <th>Tipo Python</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {TYPE_MAP.map((t) => (
                  <tr key={t.edulang}>
                    <td><span className="sem-type-badge">{t.edulang}</span></td>
                    <td><code>{t.python}</code></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ marginTop: 16, fontSize: '0.9rem' }}>
            Las declaraciones sin tipo (<code>x = 5</code>) infieren el tipo del valor asignado.
            Las declaraciones tipadas (<code>entero x = 5</code>) validan explícitamente la
            compatibilidad antes de registrar el símbolo.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Gestión de alcance</h2>
          <p className="section-subtitle">Pila de scopes para aislar variables locales de las globales</p>

          <p>
            El analizador mantiene una <strong>pila de scopes</strong>. Al iniciar existe un scope
            global. Cada llamada a función empuja un nuevo scope local y lo elimina al retornar.
            Al buscar un identificador, la pila se recorre de adentro hacia afuera — las variables
            locales tienen prioridad sobre las globales.
          </p>

          <div className="sem-split">
            <div>
              <p className="sem-label">Código de entrada</p>
              <pre className="code-block">{SCOPE_EXAMPLE}</pre>
            </div>
            <div>
              <p className="sem-label">Traza semántica</p>
              <div className="sem-trace-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ln</th>
                      <th>Acción</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SEM_TRACE.map((t, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text-muted)' }}>{t.linea}</td>
                        <td style={{ fontSize: '11px' }}>{t.accion}</td>
                        <td><code style={{ fontSize: '11px' }}>{t.valor}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Verificaciones semánticas</h2>
          <p className="section-subtitle">Reglas que el analizador aplica al recorrer el AST</p>

          <div className="sem-checks">
            {SEMANTIC_CHECKS.map((c) => (
              <div key={c.nombre} className="sem-check-card">
                <div className="sem-check-header">
                  <span className={`sem-check-icon ${c.ok ? 'ok' : 'err'}`}>
                    {c.ok ? '✓' : '✗'}
                  </span>
                  <span className="sem-check-name">{c.nombre}</span>
                </div>
                <code className="sem-check-code">{c.codigo}</code>
                <p className="sem-check-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Errores semánticos</h2>
          <p className="section-subtitle">Situaciones que el analizador detecta y reporta</p>

          <div className="sem-errors">
            {SEM_ERRORS.map((e) => (
              <div key={e.tipo} className="sem-error-card">
                <div className="sem-error-header">
                  <span className="sem-error-type">✗ {e.tipo}</span>
                </div>
                <pre className="code-block sem-error-code">{e.ejemplo}</pre>
                <p className="sem-error-detail">{e.detalle}</p>
                <p className="sem-error-fix">💡 {e.solucion}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
