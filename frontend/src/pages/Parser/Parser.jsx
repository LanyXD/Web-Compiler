import './Parser.css'

const GRAMMAR_RULES = [
  {
    lhs: '<programa>',
    rhs: ['<sentencia> { <sentencia> }'],
  },
  {
    lhs: '<sentencia>',
    rhs: [
      '<asignacion>',
      '<declaracion_tipada>',
      '<if>',
      '<mientras>',
      '<para>',
      '<funcion>',
      '<escribir>',
      '<llamada>',
      '"retornar" <expresion>',
      '"romper" | "continuar"',
    ],
  },
  {
    lhs: '<asignacion>',
    rhs: ['IDENTIFICADOR "=" <expresion>'],
  },
  {
    lhs: '<declaracion_tipada>',
    rhs: ['TIPO IDENTIFICADOR "=" <expresion>'],
    nota: 'TIPO ∈ { entero, decimal, texto, booleano, lista }',
  },
  {
    lhs: '<if>',
    rhs: [
      '"si" <expresion> ":" NEWLINE <bloque>',
      '[ "sino" ":" NEWLINE <bloque> ]',
    ],
  },
  {
    lhs: '<mientras>',
    rhs: ['"mientras" <expresion> ":" NEWLINE <bloque>'],
  },
  {
    lhs: '<para>',
    rhs: ['"para" IDENT "en" "rango" "(" <expr> "," <expr> ")" ":" NEWLINE <bloque>'],
  },
  {
    lhs: '<funcion>',
    rhs: ['"funcion" IDENT "(" [ IDENT { "," IDENT } ] ")" ":" NEWLINE <bloque>'],
  },
  {
    lhs: '<bloque>',
    rhs: ['INDENT <sentencia> { <sentencia> } DEDENT'],
  },
  {
    lhs: '<expresion>',
    rhs: ['<expresion_logica>'],
  },
  {
    lhs: '<expresion_logica>',
    rhs: ['<comparacion> { ( "y" | "o" ) <comparacion> }'],
  },
  {
    lhs: '<comparacion>',
    rhs: ['<aritmetica> [ ( "==" | "!=" | "<" | ">" | "<=" | ">=" ) <aritmetica> ]'],
  },
  {
    lhs: '<aritmetica>',
    rhs: ['<termino> { ( "+" | "-" ) <termino> }'],
  },
  {
    lhs: '<termino>',
    rhs: ['<factor> { ( "*" | "/" ) <factor> }'],
  },
  {
    lhs: '<factor>',
    rhs: [
      'NUMERO | STRING | "verdadero" | "falso" | "nulo"',
      'IDENTIFICADOR [ "(" [ args ] ")" ] [ "[" <expr> "]" ]',
      '"(" <expresion> ")"',
      '( "+" | "-" | "no" ) <factor>',
      '"[" [ <expr> { "," <expr> } ] "]"',
      '"{" { <expr> ":" <expr> } "}"',
    ],
  },
]

const AST_NODES = [
  { nombre: 'Programa',         campos: 'sentencias[]',              desc: 'Raíz del árbol — lista de sentencias de nivel superior' },
  { nombre: 'Asignacion',       campos: 'nombre, valor',             desc: 'Asignación de valor a un identificador existente' },
  { nombre: 'DeclaracionTipada',campos: 'tipo, nombre, valor',       desc: 'Declaración con tipo explícito: entero x = 5' },
  { nombre: 'If',               campos: 'condicion, cuerpo[], sino[]',desc: 'Condicional con rama sino opcional' },
  { nombre: 'While',            campos: 'condicion, cuerpo[]',       desc: 'Bucle mientras la condición sea verdadera' },
  { nombre: 'Para',             campos: 'variable, inicio, fin, cuerpo[]', desc: 'Iteración sobre rango numérico con rango()' },
  { nombre: 'Funcion',          campos: 'nombre, parametros[], cuerpo[]', desc: 'Definición de función con parámetros' },
  { nombre: 'Llamada',          campos: 'nombre, argumentos[]',      desc: 'Invocación de función de usuario o builtin' },
  { nombre: 'BinOp',            campos: 'izquierda, op, derecha',    desc: 'Operación binaria aritmética o de comparación' },
  { nombre: 'LogicalOp',        campos: 'izquierda, op, derecha',    desc: 'Operación lógica: y / o' },
  { nombre: 'UnaryOp',          campos: 'op, valor',                 desc: 'Operación unaria: +, -, no' },
  { nombre: 'Identificador',    campos: 'nombre',                    desc: 'Referencia a una variable o función' },
  { nombre: 'Numero',           campos: 'valor',                     desc: 'Literal numérico — entero o decimal' },
  { nombre: 'Cadena',           campos: 'valor',                     desc: 'Literal de texto entre comillas' },
  { nombre: 'Booleano',         campos: 'valor',                     desc: 'Literal verdadero o falso' },
  { nombre: 'Lista',            campos: 'elementos[]',               desc: 'Literal de lista entre corchetes' },
  { nombre: 'Diccionario',      campos: 'pares[]',                   desc: 'Literal de diccionario clave-valor entre llaves' },
  { nombre: 'Retornar',         campos: 'valor',                     desc: 'Retorno de un valor desde una función' },
  { nombre: 'Nulo',             campos: '—',                         desc: 'Valor nulo del lenguaje' },
]

const PARSE_EXAMPLE_INPUT = `si vida > 0:
    escribir(nombre)`

const PARSE_TRACE = [
  { linea: 1, token: 'si',       accion: 'Match PALABRA_RESERVADA → if_stmt',         valido: true },
  { linea: 1, token: 'vida',     accion: 'Match IDENTIFICADOR → factor → aritmetica', valido: true },
  { linea: 1, token: '>',        accion: 'Match OPERADOR → comparacion',              valido: true },
  { linea: 1, token: '0',        accion: 'Match NUMERO → factor',                    valido: true },
  { linea: 1, token: ':',        accion: 'Match SIMBOLO ":"',                        valido: true },
  { linea: 1, token: '\\n',      accion: 'Match NEWLINE → inicio de bloque',         valido: true },
  { linea: 2, token: 'INDENT',   accion: 'Match INDENT → abrir bloque',              valido: true },
  { linea: 2, token: 'escribir', accion: 'Match PALABRA_RESERVADA → escribir',       valido: true },
  { linea: 2, token: '(',        accion: 'Match SIMBOLO "("',                        valido: true },
  { linea: 2, token: 'nombre',   accion: 'Match IDENTIFICADOR → factor',             valido: true },
  { linea: 2, token: ')',        accion: 'Match SIMBOLO ")"',                        valido: true },
  { linea: 2, token: 'DEDENT',   accion: 'Match DEDENT → cerrar bloque',             valido: true },
]

const PARSE_ERRORS = [
  {
    tipo: 'Sintaxis inválida',
    ejemplo: 'si vida > :\n    escribir(nombre)',
    detalle: 'Se esperaba una expresión después de ">", pero se encontró ":"',
    solucion: 'Completar la expresión de comparación antes del ":"',
  },
  {
    tipo: 'Sentencia inválida',
    ejemplo: '100 + nombre',
    detalle: 'Una sentencia no puede comenzar con un número como expresión independiente',
    solucion: 'Asignar la expresión a una variable: resultado = 100 + nombre',
  },
  {
    tipo: 'Bloque sin indentar',
    ejemplo: 'si vida > 0:\nescribir(nombre)',
    detalle: 'El cuerpo del "si" debe estar indentado con 4 espacios — no se encontró INDENT',
    solucion: 'Agregar 4 espacios de sangría al inicio de cada línea del bloque',
  },
]

export default function Parser() {
  return (
    <div className="page">
      <div className="container">

        <section className="section">
          <h2 className="section-title">Fase 2 — Análisis Sintáctico</h2>
          <p className="section-subtitle">Verificación de estructura gramatical y construcción del AST</p>
          <p>
            El analizador sintáctico recibe la lista de tokens producida por el lexer y verifica
            que su secuencia sea gramaticalmente válida. Usa un <strong>análisis descendente
            recursivo</strong> — cada regla de la gramática corresponde directamente a un método
            del parser — y construye un <strong>Árbol Sintáctico Abstracto (AST)</strong> que
            representa la estructura lógica del programa.
          </p>
          <p>
            Los bloques de código se delimitan por tokens <code>INDENT</code> y{' '}
            <code>DEDENT</code> en lugar de llaves, siguiendo el modelo de indentación del
            lenguaje. Cada coincidencia exitosa con la gramática queda registrada en la{' '}
            <em>traza de análisis</em>, facilitando la depuración.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Gramática formal</h2>
          <p className="section-subtitle">Reglas BNF del lenguaje</p>

          <div className="par-grammar">
            {GRAMMAR_RULES.map((r) => (
              <div key={r.lhs} className="par-rule">
                <span className="par-lhs">{r.lhs}</span>
                <span className="par-arrow">::=</span>
                <div className="par-rhs">
                  {r.rhs.map((alt, i) => (
                    <div key={i} className="par-alt">
                      {i > 0 && <span className="par-pipe">|</span>}
                      <code>{alt}</code>
                    </div>
                  ))}
                  {r.nota && <p className="par-nota">{r.nota}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Nodos del AST</h2>
          <p className="section-subtitle">Estructuras que componen el árbol sintáctico abstracto</p>

          <div className="par-nodes">
            {AST_NODES.map((n) => (
              <div key={n.nombre} className="par-node-row">
                <div className="par-node-name">{n.nombre}</div>
                <code className="par-node-fields">{n.campos}</code>
                <p className="par-node-desc">{n.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Ejemplo de análisis</h2>
          <p className="section-subtitle">Código fuente → traza de derivación → AST resultante</p>

          <div className="par-split">
            <div>
              <p className="par-label">Código de entrada</p>
              <pre className="code-block">{PARSE_EXAMPLE_INPUT}</pre>

              <p className="par-label" style={{ marginTop: 24 }}>AST resultante</p>
              <pre className="code-block">{`Programa
└─ If
   ├─ condicion: BinOp(vida > 0)
   │   ├─ izq: Identificador(vida)
   │   ├─ op:  ">"
   │   └─ der: Numero(0)
   └─ cuerpo:
       └─ Escribir
           └─ Identificador(nombre)`}</pre>
            </div>
            <div>
              <p className="par-label">Traza de derivación</p>
              <div className="par-trace-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ln</th>
                      <th>Token</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PARSE_TRACE.map((t, i) => (
                      <tr key={i} className={t.valido ? '' : 'par-trace-err'}>
                        <td style={{ color: 'var(--text-muted)' }}>{t.linea}</td>
                        <td><code>{t.token}</code></td>
                        <td style={{ fontSize: '11px' }}>{t.accion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Errores sintácticos</h2>
          <p className="section-subtitle">Situaciones que el parser detecta y reporta</p>

          <div className="par-errors">
            {PARSE_ERRORS.map((e) => (
              <div key={e.tipo} className="par-error-card">
                <div className="par-error-header">
                  <span className="par-error-type">✗ {e.tipo}</span>
                </div>
                <pre className="code-block par-error-code">{e.ejemplo}</pre>
                <p className="par-error-detail">{e.detalle}</p>
                <p className="par-error-fix">💡 {e.solucion}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
