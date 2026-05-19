import './Symbols.css'

const SYM_FIELDS = [
  { campo: 'nombre', tipo: 'str', desc: 'Identificador único del símbolo en su scope' },
  { campo: 'tipo',   tipo: 'str', desc: 'Tipo del valor: int, float, str, bool, list, function…' },
  { campo: 'valor',  tipo: 'any', desc: 'Valor actual asignado al símbolo' },
  { campo: 'linea',  tipo: 'int', desc: 'Línea del código fuente donde fue declarado' },
  { campo: 'scope',  tipo: 'str', desc: '"global" para nivel superior, "local" dentro de funciones' },
]

const EXAMPLE_CODE = `vida = 100
nombre = "Guardia"
entero nivel = 5
booleano activo = verdadero
items = ["espada", "escudo"]

funcion saludar(n):
    mensaje = "Hola " + n
    retornar mensaje`

const SYMBOL_TABLE = [
  { nombre: 'vida',    tipo: 'int',      valor: '100',                   linea: 1, scope: 'global' },
  { nombre: 'nombre',  tipo: 'str',      valor: '"Guardia"',             linea: 2, scope: 'global' },
  { nombre: 'nivel',   tipo: 'entero',   valor: '5',                     linea: 3, scope: 'global' },
  { nombre: 'activo',  tipo: 'booleano', valor: 'verdadero',             linea: 4, scope: 'global' },
  { nombre: 'items',   tipo: 'list',     valor: '["espada", "escudo"]',  linea: 5, scope: 'global' },
  { nombre: 'saludar', tipo: 'function', valor: '<func(n)>',             linea: 7, scope: 'global' },
  { nombre: 'n',       tipo: 'str',      valor: '"Guardia"',             linea: 7, scope: 'local'  },
  { nombre: 'mensaje', tipo: 'str',      valor: '"Hola Guardia"',        linea: 8, scope: 'local'  },
]

const BUILTINS = [
  { nombre: 'largo',   firma: 'largo(lista)',     desc: 'Devuelve la longitud de una lista o texto' },
  { nombre: 'tipo',    firma: 'tipo(valor)',       desc: 'Devuelve el tipo Python interno del valor' },
  { nombre: 'mayus',   firma: 'mayus(texto)',      desc: 'Convierte un texto a mayúsculas' },
  { nombre: 'minus',   firma: 'minus(texto)',      desc: 'Convierte un texto a minúsculas' },
  { nombre: 'agregar', firma: 'agregar(lista, x)', desc: 'Agrega un elemento al final de la lista' },
  { nombre: 'ordenar', firma: 'ordenar(lista)',    desc: 'Retorna una copia ordenada de la lista' },
]

export default function Symbols() {
  return (
    <div className="page">
      <div className="container">

        <section className="section">
          <h2 className="section-title">Tabla de Símbolos</h2>
          <p className="section-subtitle">Registro de variables y funciones durante el análisis semántico</p>
          <p>
            La tabla de símbolos es la estructura de datos central del compilador. Durante el
            análisis semántico, cada variable declarada o función definida genera una entrada
            con su <strong>nombre</strong>, <strong>tipo</strong>, <strong>valor</strong>,{' '}
            <strong>línea</strong> y <strong>alcance</strong>.
          </p>
          <p>
            El analizador mantiene una <em>pila de tablas</em> — una por nivel de alcance — lo
            que permite aislar variables locales de las globales y resolver correctamente los
            nombres al buscar un identificador. Cuando una función termina, su tabla local
            es descartada de la pila.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Estructura de un símbolo</h2>
          <p className="section-subtitle">Campos que almacena cada entrada de la tabla</p>

          <div className="sym-fields">
            {SYM_FIELDS.map((f) => (
              <div key={f.campo} className="sym-field-row">
                <code className="sym-field-name">{f.campo}</code>
                <span className="sym-field-type">{f.tipo}</span>
                <p className="sym-field-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Ejemplo de tabla de símbolos</h2>
          <p className="section-subtitle">Estado de la tabla tras ejecutar el código de entrada</p>

          <div className="sym-split">
            <div>
              <p className="sym-label">Código analizado</p>
              <pre className="code-block">{EXAMPLE_CODE}</pre>
            </div>
            <div>
              <p className="sym-label">Tabla generada</p>
              <div className="sym-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                      <th>Ln</th>
                      <th>Scope</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SYMBOL_TABLE.map((s, i) => (
                      <tr key={i}>
                        <td><code>{s.nombre}</code></td>
                        <td>
                          <span className={`sym-type-badge ${s.tipo === 'function' ? 'func' : ''}`}>
                            {s.tipo}
                          </span>
                        </td>
                        <td><code style={{ fontSize: '11px' }}>{s.valor}</code></td>
                        <td style={{ color: 'var(--text-muted)' }}>{s.linea}</td>
                        <td>
                          <span className={`sym-scope-pill ${s.scope}`}>{s.scope}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Funciones incorporadas (builtins)</h2>
          <p className="section-subtitle">Disponibles sin declaración previa — registradas al inicio del análisis</p>

          <div className="sym-builtins">
            {BUILTINS.map((b) => (
              <div key={b.nombre} className="sym-builtin-card">
                <code className="sym-builtin-sig">{b.firma}</code>
                <p className="sym-builtin-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
