import './Language.css'

const KEYWORDS = [
  { word: 'si',      use: 'Condición — equivale a if' },
  { word: 'sino',    use: 'Alternativa — equivale a else' },
  { word: 'cuando',  use: 'Evento con condición' },
  { word: 'al',      use: 'Evento de inicio o trigger' },
  { word: 'ejecutar',use: 'Ejecutar una lista de acciones' },
  { word: 'y',       use: 'Operador lógico AND' },
  { word: 'o',       use: 'Operador lógico OR' },
  { word: 'no',      use: 'Operador lógico NOT' },
  { word: 'mientras',use: 'Bucle — equivale a while' },
  { word: 'para',    use: 'Bucle — equivale a for' },
  { word: 'funcion', use: 'Definición de función' },
  { word: 'retornar',use: 'Retorno de valor' },
  { word: 'escribir',use: 'Salida por consola — equivale a print' },
]

const EXAMPLES = [
  {
    title: 'Regla simple con condición',
    code: `si (guardia activo):
    ejecutar moverse, atacar`,
  },
  {
    title: 'Evento de mundo',
    code: `cuando jugador entra_zona:
    ejecutar activar_trampa, reproducir_sonido`,
  },
  {
    title: 'Trigger al inicio',
    code: `al iniciar_mision:
    ejecutar mostrar_dialogo, spawnear_enemigos`,
  },
  {
    title: 'Condición compuesta',
    code: `si (guardia hostil y jugador visible):
    ejecutar perseguir, alertar_base`,
  },
  {
    title: 'Variable y salida',
    code: `vida = 100
nombre = "Guardia"
escribir(nombre)
escribir(vida)`,
  },
  {
    title: 'Función con retorno',
    code: `funcion esta_vivo(vida):
    si vida > 0:
        retornar verdadero
    retornar falso`,
  },
]

export default function Language() {
  return (
    <div className="page">
      <div className="container">

        {/* ── DESCRIPCIÓN ───────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">El Lenguaje</h2>
          <p className="section-subtitle">Game-Logic Script — lenguaje de scripting para NPCs y eventos de mundo</p>

          <p>
            El lenguaje desarrollado en este proyecto está diseñado para describir el comportamiento
            de personajes no jugables y la activación de eventos dentro de un videojuego. Su sintaxis
            está inspirada en Python y utiliza <strong>palabras clave en español</strong>, lo que
            facilita su comprensión y adopción por equipos de diseño narrativo.
          </p>
          <p>
            Un programa válido en este lenguaje está compuesto por una o más <em>reglas</em>.
            Cada regla define una condición o evento, y una lista de acciones a ejecutar cuando
            dicha condición se cumple.
          </p>
        </section>

        {/* ── PALABRAS RESERVADAS ───────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Palabras reservadas</h2>
          <p className="section-subtitle">Símbolos terminales del lenguaje</p>

          <div className="lang-keyword-grid">
            {KEYWORDS.map((k) => (
              <div key={k.word} className="lang-keyword-card">
                <span className="lang-keyword">{k.word}</span>
                <span className="lang-keyword-use">{k.use}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SÍMBOLOS ESPECIALES ───────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Símbolos especiales</h2>

          <div className="card-grid">
            {[
              { sym: '( )',  name: 'Paréntesis', desc: 'Agrupan condiciones lógicas' },
              { sym: ':',   name: 'Dos puntos',  desc: 'Separan la condición del cuerpo' },
              { sym: ',',   name: 'Coma',         desc: 'Separan acciones en una lista' },
              { sym: '=',   name: 'Asignación',  desc: 'Asignan un valor a una variable' },
            ].map((s) => (
              <div key={s.sym} className="card lang-sym-card">
                <span className="lang-sym">{s.sym}</span>
                <strong>{s.name}</strong>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ESTRUCTURA ────────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Estructura de un programa</h2>
          <p className="section-subtitle">Un programa es una secuencia de reglas</p>

          <p>Cada regla sigue uno de estos tres patrones:</p>

          <div className="lang-patterns">
            {[
              { pattern: 'si (condición) : ejecutar acciones',      label: 'Condicional' },
              { pattern: 'cuando evento : ejecutar acciones',        label: 'Evento con when' },
              { pattern: 'al evento : ejecutar acciones',            label: 'Trigger de inicio' },
            ].map((p) => (
              <div key={p.label} className="lang-pattern-row">
                <span className="badge badge-gold">{p.label}</span>
                <code className="lang-pattern-code">{p.pattern}</code>
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

        {/* ── IDENTIFICADORES Y NÚMEROS ─────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Identificadores y valores</h2>

          <div className="card-grid">
            <div className="card">
              <h3>Identificadores</h3>
              <p>
                Son nombres usados para representar NPCs, objetos, eventos, estados,
                acciones y variables. Deben comenzar con una letra y pueden contener
                letras, números y guiones bajos.
              </p>
              <pre className="code-block">{'guardia\njugador\nactivar_trampa\nvida_maxima'}</pre>
            </div>
            <div className="card">
              <h3>Valores numéricos</h3>
              <p>
                Se utilizan números enteros positivos para representar cantidades,
                niveles, distancias u otros atributos del juego.
              </p>
              <pre className="code-block">{'nivel 5\nvida 100\ndistancia 3'}</pre>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}