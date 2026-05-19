import './Lexer.css'

const TOKEN_TYPES = [
  {
    tipo: 'PALABRA_RESERVADA',
    color: 'purple',
    desc: 'Palabras del lenguaje con significado fijo',
    ejemplos: ['si', 'sino', 'mientras', 'para', 'en', 'rango', 'funcion', 'retornar', 'escribir', 'romper', 'continuar', 'verdadero', 'falso', 'nulo', 'entero', 'decimal', 'texto', 'booleano', 'lista'],
  },
  {
    tipo: 'IDENTIFICADOR',
    color: 'blue',
    desc: 'Nombres de variables, funciones o parámetros definidos por el usuario',
    ejemplos: ['guardia', 'vida', 'activar_trampa', 'jugador', 'calcular'],
  },
  {
    tipo: 'NUMERO',
    color: 'orange',
    desc: 'Valores numéricos enteros o decimales',
    ejemplos: ['0', '5', '100', '3.14', '99.9'],
  },
  {
    tipo: 'STRING',
    color: 'green',
    desc: 'Cadenas de texto entre comillas simples o dobles',
    ejemplos: ['"Hola"', '"NPC Guardia"', "'atacar'"],
  },
  {
    tipo: 'OPERADOR',
    color: 'teal',
    desc: 'Símbolos de comparación, asignación y aritmética',
    ejemplos: ['=', '==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/'],
  },
  {
    tipo: 'SIMBOLO',
    color: 'gray',
    desc: 'Delimitadores y separadores del lenguaje',
    ejemplos: ['(', ')', '[', ']', '{', '}', ':', ',', '.'],
  },
  {
    tipo: 'NEWLINE',
    color: 'gray',
    desc: 'Fin de línea — delimita instrucciones',
    ejemplos: ['\\n'],
  },
  {
    tipo: 'INDENT / DEDENT',
    color: 'gold',
    desc: 'Control de bloques por indentación (4 espacios). Se suspende dentro de paréntesis, corchetes y llaves.',
    ejemplos: ['INDENT', 'DEDENT'],
  },
]

const EXAMPLE_INPUT = `vida = 100
nombre = "Guardia"
si vida > 0:
    escribir(nombre)`

const EXAMPLE_TOKENS = [
  { tipo: 'IDENTIFICADOR',    valor: 'vida',     linea: 1 },
  { tipo: 'OPERADOR',         valor: '=',        linea: 1 },
  { tipo: 'NUMERO',           valor: '100',      linea: 1 },
  { tipo: 'NEWLINE',          valor: '\\n',      linea: 1 },
  { tipo: 'IDENTIFICADOR',    valor: 'nombre',   linea: 2 },
  { tipo: 'OPERADOR',         valor: '=',        linea: 2 },
  { tipo: 'STRING',           valor: 'Guardia',  linea: 2 },
  { tipo: 'NEWLINE',          valor: '\\n',      linea: 2 },
  { tipo: 'PALABRA_RESERVADA',valor: 'si',       linea: 3 },
  { tipo: 'IDENTIFICADOR',    valor: 'vida',     linea: 3 },
  { tipo: 'OPERADOR',         valor: '>',        linea: 3 },
  { tipo: 'NUMERO',           valor: '0',        linea: 3 },
  { tipo: 'SIMBOLO',          valor: ':',        linea: 3 },
  { tipo: 'NEWLINE',          valor: '\\n',      linea: 3 },
  { tipo: 'INDENT',           valor: 'INDENT',   linea: 4 },
  { tipo: 'PALABRA_RESERVADA',valor: 'escribir', linea: 4 },
  { tipo: 'SIMBOLO',          valor: '(',        linea: 4 },
  { tipo: 'IDENTIFICADOR',    valor: 'nombre',   linea: 4 },
  { tipo: 'SIMBOLO',          valor: ')',        linea: 4 },
  { tipo: 'DEDENT',           valor: 'DEDENT',   linea: 4 },
]

const LEXIC_ERRORS = [
  {
    tipo: 'Carácter inválido',
    ejemplo: 'vida @ 100',
    detalle: 'El símbolo @ no pertenece al lenguaje',
    solucion: 'Eliminar el carácter inválido',
  },
  {
    tipo: 'Cadena sin cerrar',
    ejemplo: 'nombre = "Guardia',
    detalle: 'La cadena fue abierta pero nunca cerrada con su delimitador',
    solucion: 'Agregar la comilla de cierre correspondiente',
  },
]

function tokenColor(tipo) {
  const map = {
    PALABRA_RESERVADA: 'token-purple',
    IDENTIFICADOR:     'token-blue',
    NUMERO:            'token-orange',
    STRING:            'token-green',
    OPERADOR:          'token-teal',
    SIMBOLO:           'token-gray',
    NEWLINE:           'token-gray',
    INDENT:            'token-gold',
    DEDENT:            'token-gold',
  }
  return map[tipo] ?? 'token-gray'
}

export default function Lexer() {
  return (
    <div className="page">
      <div className="container">

        <section className="section">
          <h2 className="section-title">Fase 1 — Análisis Léxico</h2>
          <p className="section-subtitle">Tokenización del código fuente</p>
          <p>
            El analizador léxico es la primera fase del compilador. Su función es leer el código
            fuente carácter a carácter e identificar las unidades mínimas con significado,
            llamadas <strong>tokens</strong>. Cada token tiene un tipo, un valor y el número de
            línea donde aparece.
          </p>
          <p>
            El lexer maneja la <strong>indentación</strong> del lenguaje — los bloques se definen
            por niveles de sangría de 4 espacios, generando tokens <code>INDENT</code> y{' '}
            <code>DEDENT</code> para abrir y cerrar bloques. Este control se suspende
            automáticamente dentro de paréntesis, corchetes y llaves, permitiendo expresiones
            multilínea. Los <strong>comentarios</strong> (líneas que inician con <code>#</code>)
            son ignorados completamente.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Tipos de tokens</h2>

          <div className="lex-token-list">
            {TOKEN_TYPES.map((t) => (
              <div key={t.tipo} className="lex-token-row">
                <span className={`lex-token-badge ${t.color}`}>{t.tipo}</span>
                <div className="lex-token-info">
                  <p>{t.desc}</p>
                  <div className="lex-token-examples">
                    {t.ejemplos.map((e) => (
                      <code key={e} className="lex-example-chip">{e}</code>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Ejemplo de tokenización</h2>
          <p className="section-subtitle">Entrada de código → tabla de tokens generados</p>

          <div className="lex-split">
            <div>
              <p className="lex-label">Código de entrada</p>
              <pre className="code-block">{EXAMPLE_INPUT}</pre>
            </div>
            <div>
              <p className="lex-label">Tokens generados</p>
              <div className="lex-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                      <th>Línea</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXAMPLE_TOKENS.map((t, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td>
                          <span className={`lex-token-badge sm ${tokenColor(t.tipo)}`}>
                            {t.tipo}
                          </span>
                        </td>
                        <td><code>{t.valor}</code></td>
                        <td style={{ color: 'var(--text-muted)' }}>{t.linea}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Errores léxicos</h2>
          <p className="section-subtitle">Situaciones que el lexer detecta y reporta</p>

          <div className="lex-errors">
            {LEXIC_ERRORS.map((e) => (
              <div key={e.tipo} className="lex-error-card">
                <div className="lex-error-header">
                  <span className="lex-error-type">✗ {e.tipo}</span>
                </div>
                <pre className="code-block lex-error-code">{e.ejemplo}</pre>
                <p className="lex-error-detail">{e.detalle}</p>
                <p className="lex-error-fix">💡 {e.solucion}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}