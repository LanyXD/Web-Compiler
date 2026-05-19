import './Language.css'

const KEYWORDS = [
  { word: 'si',        use: 'Condicional — equivale a if' },
  { word: 'sino',      use: 'Alternativa — equivale a else' },
  { word: 'mientras',  use: 'Bucle condicional — equivale a while' },
  { word: 'para',      use: 'Bucle de rango — equivale a for' },
  { word: 'en',        use: 'Parte del bucle para (para x en rango)' },
  { word: 'rango',     use: 'Define el rango del bucle para' },
  { word: 'funcion',   use: 'Define una función' },
  { word: 'retornar',  use: 'Retorna un valor desde una función' },
  { word: 'escribir',  use: 'Imprime un valor — equivale a print' },
  { word: 'romper',    use: 'Sale del bucle actual — equivale a break' },
  { word: 'continuar', use: 'Salta a la siguiente iteración — equivale a continue' },
  { word: 'verdadero', use: 'Valor booleano true' },
  { word: 'falso',     use: 'Valor booleano false' },
  { word: 'nulo',      use: 'Valor nulo — equivale a None/null' },
  { word: 'y',         use: 'Operador lógico AND' },
  { word: 'o',         use: 'Operador lógico OR' },
  { word: 'no',        use: 'Operador lógico NOT (unario)' },
  { word: 'entero',    use: 'Tipo de dato — número entero' },
  { word: 'decimal',   use: 'Tipo de dato — número decimal' },
  { word: 'texto',     use: 'Tipo de dato — cadena de texto' },
  { word: 'booleano',  use: 'Tipo de dato — verdadero o falso' },
  { word: 'lista',     use: 'Tipo de dato — colección ordenada' },
]

const EXAMPLES = [
  {
    title: 'Asignación simple',
    code: `vida = 100\nnombre = "Guardia"\nactivo = verdadero`,
  },
  {
    title: 'Declaración tipada',
    code: `entero nivel = 5\ndecimal velocidad = 1.5\ntexto rol = "guardia"`,
  },
  {
    title: 'Condicional si/sino',
    code: `si vida > 0:\n    escribir("Vivo")\nsino:\n    escribir("Muerto")`,
  },
  {
    title: 'Bucle mientras',
    code: `i = 0\nmientras i < 5:\n    escribir(i)\n    i = i + 1`,
  },
  {
    title: 'Bucle para',
    code: `para i en rango(0, 5):\n    escribir(i)`,
  },
  {
    title: 'Función con retorno',
    code: `funcion cuadrado(n):\n    retornar n * n\n\nresultado = cuadrado(7)\nescribir(resultado)`,
  },
  {
    title: 'Operadores lógicos',
    code: `si vida > 0 y activo:\n    escribir("En combate")\n\nsi no activo o vida == 0:\n    escribir("Inactivo")`,
  },
  {
    title: 'Listas y diccionarios',
    code: `inventario = [1, 2, 3]\nitem = inventario[0]\n\nstats = {"vida": 100, "nivel": 5}`,
  },
]

const BUILTINS = [
  { name: 'largo(x)',  desc: 'Retorna la longitud de una lista o cadena' },
  { name: 'mayus(x)',  desc: 'Convierte una cadena a mayúsculas' },
  { name: 'minus(x)',  desc: 'Convierte una cadena a minúsculas' },
  { name: 'tipo(x)',   desc: 'Retorna el tipo del valor como texto' },
]

export default function Language() {
  return (
    <div className="page">
      <div className="container">

        {/* ── DESCRIPCIÓN ───────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">El Lenguaje</h2>
          <p className="section-subtitle">EduLang — lenguaje de scripting con sintaxis en español</p>

          <p>
            El lenguaje desarrollado en este proyecto tiene una sintaxis inspirada en Python
            y utiliza <strong>palabras clave en español</strong>. Está orientado a la definición
            de comportamientos de NPCs y lógica de juego, con soporte para variables, tipos de
            datos, funciones, condicionales, bucles, listas y diccionarios.
          </p>
          <p>
            Los bloques de código se definen por <strong>indentación de 4 espacios</strong>,
            y cada instrucción ocupa una línea. Las funciones definidas por el usuario pueden
            recibir parámetros y retornar valores.
          </p>
        </section>

        {/* ── PALABRAS RESERVADAS ───────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Palabras reservadas</h2>
          <p className="section-subtitle">{KEYWORDS.length} palabras clave reconocidas por el lexer</p>

          <div className="lang-keyword-grid">
            {KEYWORDS.map((k) => (
              <div key={k.word} className="lang-keyword-card">
                <span className="lang-keyword">{k.word}</span>
                <span className="lang-keyword-use">{k.use}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIPOS DE DATOS ────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Tipos de datos</h2>

          <div className="card-grid">
            {[
              { tipo: 'entero',   ejemplo: 'entero vida = 100',         equiv: 'int' },
              { tipo: 'decimal',  ejemplo: 'decimal vel = 1.5',         equiv: 'float' },
              { tipo: 'texto',    ejemplo: 'texto nombre = "Guardia"',  equiv: 'str' },
              { tipo: 'booleano', ejemplo: 'booleano activo = verdadero', equiv: 'bool' },
              { tipo: 'lista',    ejemplo: 'lista items = [1, 2, 3]',   equiv: 'list' },
            ].map((t) => (
              <div key={t.tipo} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="lang-keyword">{t.tipo}</span>
                  <span className="badge badge-primary">{t.equiv}</span>
                </div>
                <pre className="code-block" style={{ fontSize: 11, padding: '8px 12px' }}>{t.ejemplo}</pre>
              </div>
            ))}
          </div>
        </section>

        {/* ── OPERADORES ────────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Operadores</h2>

          <div className="card-grid">
            {[
              { grupo: 'Aritméticos',  ops: ['+', '-', '*', '/'] },
              { grupo: 'Comparación',  ops: ['==', '!=', '<', '>', '<=', '>='] },
              { grupo: 'Lógicos',      ops: ['y', 'o', 'no'] },
              { grupo: 'Asignación',   ops: ['='] },
            ].map((g) => (
              <div key={g.grupo} className="card">
                <h3 style={{ fontSize: '0.9rem', marginBottom: 10 }}>{g.grupo}</h3>
                <div className="lang-ops">
                  {g.ops.map((op) => (
                    <code key={op} className="lang-op-chip">{op}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FUNCIONES INTEGRADAS ──────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Funciones integradas</h2>
          <p className="section-subtitle">Builtins disponibles sin necesidad de definirlos</p>

          <div className="card-grid">
            {BUILTINS.map((b) => (
              <div key={b.name} className="card">
                <code className="lang-keyword" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                  {b.name}
                </code>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── EJEMPLOS ──────────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Ejemplos de código válido</h2>

          <div className="lang-examples">
            {EXAMPLES.map((ex) => (
              <div key={ex.title} className="lang-example">
                <p className="lang-example-title">{ex.title}</p>
                <pre className="code-block">{ex.code}</pre>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
