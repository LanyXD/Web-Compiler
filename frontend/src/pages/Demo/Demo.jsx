import { useState } from 'react'
import { compilarCodigo } from '../../services/compilerApi'
import './Demo.css'

const EJEMPLOS = [
  {
    label: 'Hola Guardia',
    codigo: `nombre = "Guardia"
vida = 100
escribir(nombre)
escribir(vida)`,
  },
  {
    label: 'Condicional',
    codigo: `vida = 75

si vida > 50:
    escribir("El guardia está vivo")
sino:
    escribir("El guardia ha caído")`,
  },
  {
    label: 'Función',
    codigo: `funcion calcular_danio(base, multiplicador):
    retornar base * multiplicador

espada = 15
critico = calcular_danio(espada, 2)
escribir(critico)`,
  },
  {
    label: 'Bucle para',
    codigo: `para i en rango(1, 6):
    escribir(i)`,
  },
  {
    label: 'Tipos y lista',
    codigo: `entero nivel = 5
texto nombre = "Mago"
booleano activo = verdadero
lista items = ["vara", "libro", "manto"]

escribir(nivel)
escribir(nombre)
escribir(activo)
escribir(largo(items))`,
  },
]

const RESULT_TABS = [
  { id: 'salida',     label: 'Salida' },
  { id: 'tokens',     label: 'Tokens' },
  { id: 'simbolos',   label: 'Símbolos' },
  { id: 'python',     label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'csharp',     label: 'C#' },
]

const TOKEN_COLOR = {
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

export default function Demo() {
  const [codigo, setCodigo]       = useState(EJEMPLOS[0].codigo)
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando]   = useState(false)
  const [activeTab, setActiveTab] = useState('salida')

  async function handleCompilar() {
    if (!codigo.trim()) return
    setCargando(true)
    setResultado(null)
    try {
      const data = await compilarCodigo(codigo)
      setResultado(data)
      setActiveTab('salida')
    } catch {
      setResultado({
        exito: false,
        tokens: [],
        salida: [],
        simbolos: [],
        generado: { python: '', javascript: '', csharp: '' },
        error: {
          linea: 0,
          error: 'Sin conexión',
          detalle: 'No se pudo conectar con el servidor del compilador',
          solucion: 'Verifica que el backend esté ejecutándose en localhost:8000',
        },
      })
    } finally {
      setCargando(false)
    }
  }

  function handleEjemplo(ej) {
    setCodigo(ej.codigo)
    setResultado(null)
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd } = e.target
      const next = codigo.substring(0, selectionStart) + '    ' + codigo.substring(selectionEnd)
      setCodigo(next)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4
      })
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleCompilar()
    }
  }

  const hasResult = resultado !== null
  const error     = resultado?.error
  const tokens    = resultado?.tokens    ?? []
  const salida    = resultado?.salida    ?? []
  const simbolos  = resultado?.simbolos  ?? []
  const generado  = resultado?.generado  ?? { python: '', javascript: '', csharp: '' }

  return (
    <div className="page">
      <div className="container">

        {/* ── HEADER ── */}
        <section className="section demo-header-section">
          <h2 className="section-title">Demo Interactivo</h2>
          <p className="section-subtitle">
            Escribe código EduLang y compílalo — la salida, los tokens, la tabla de símbolos
            y el código generado aparecen al instante
          </p>
        </section>

        {/* ── EJEMPLOS ── */}
        <div className="demo-snippets">
          <span className="demo-snippets-label">Ejemplos:</span>
          {EJEMPLOS.map((ej) => (
            <button
              key={ej.label}
              className="demo-snippet-btn"
              onClick={() => handleEjemplo(ej)}
            >
              {ej.label}
            </button>
          ))}
        </div>

        {/* ── EDITOR + RESULTADOS ── */}
        <div className="demo-workspace">

          {/* LEFT: editor */}
          <div className="demo-editor-col">
            <div className="demo-panel-header">
              <span className="demo-panel-title">Editor EduLang</span>
              <span className="demo-panel-hint">Ctrl+Enter para compilar</span>
            </div>
            <textarea
              className="demo-editor"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              placeholder="Escribe tu código aquí..."
            />
            <button
              className={`demo-compile-btn ${cargando ? 'loading' : ''}`}
              onClick={handleCompilar}
              disabled={cargando}
            >
              {cargando ? 'Compilando...' : 'Compilar'}
            </button>
          </div>

          {/* RIGHT: results */}
          <div className="demo-results-col">
            <div className="demo-panel-header">
              <span className="demo-panel-title">Resultados</span>
              {hasResult && (
                <span className={`demo-status ${resultado.exito ? 'ok' : 'err'}`}>
                  {resultado.exito ? '✓ Exitoso' : '✗ Error'}
                </span>
              )}
            </div>

            {!hasResult && (
              <div className="demo-empty">
                <p>Escribe código en el editor y presiona <strong>Compilar</strong></p>
              </div>
            )}

            {hasResult && (
              <>
                {/* ERROR BANNER */}
                {error && (
                  <div className="demo-error-card">
                    <div className="demo-error-title">✗ {error.error}</div>
                    {error.linea > 0 && (
                      <div className="demo-error-line">Línea {error.linea}</div>
                    )}
                    <p className="demo-error-detail">{error.detalle}</p>
                    <p className="demo-error-fix">💡 {error.solucion}</p>
                  </div>
                )}

                {/* TABS — only when successful */}
                {resultado.exito && (
                  <>
                    <div className="demo-tabs">
                      {RESULT_TABS.map((t) => (
                        <button
                          key={t.id}
                          className={`demo-tab ${activeTab === t.id ? 'active' : ''}`}
                          onClick={() => setActiveTab(t.id)}
                        >
                          {t.label}
                          {t.id === 'tokens'   && <span className="demo-tab-count">{tokens.length}</span>}
                          {t.id === 'simbolos' && <span className="demo-tab-count">{simbolos.length}</span>}
                        </button>
                      ))}
                    </div>

                    <div className="demo-tab-content">

                      {/* SALIDA */}
                      {activeTab === 'salida' && (
                        <div className="demo-output">
                          {salida.length === 0
                            ? <p className="demo-output-empty">Sin salida — el programa no llamó a escribir()</p>
                            : salida.map((line, i) => (
                              <div key={i} className="demo-output-line">
                                <span className="demo-output-idx">{i + 1}</span>
                                <code>{line}</code>
                              </div>
                            ))
                          }
                        </div>
                      )}

                      {/* TOKENS */}
                      {activeTab === 'tokens' && (
                        <div className="demo-table-wrap">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Ln</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tokens.map((t, i) => (
                                <tr key={i}>
                                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                                  <td>
                                    <span className={`demo-token-badge ${TOKEN_COLOR[t.tipo] ?? 'token-gray'}`}>
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
                      )}

                      {/* SÍMBOLOS */}
                      {activeTab === 'simbolos' && (
                        <div className="demo-table-wrap">
                          {simbolos.length === 0
                            ? <p className="demo-output-empty" style={{ padding: 16 }}>No hay símbolos registrados</p>
                            : (
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
                                  {simbolos.map((s, i) => (
                                    <tr key={i}>
                                      <td><code>{s.nombre}</code></td>
                                      <td>
                                        <span className={`demo-scope-badge ${s.tipo === 'function' ? 'func' : ''}`}>
                                          {s.tipo}
                                        </span>
                                      </td>
                                      <td><code style={{ fontSize: '11px' }}>{s.valor}</code></td>
                                      <td style={{ color: 'var(--text-muted)' }}>{s.linea}</td>
                                      <td>
                                        <span className={`demo-scope-pill ${s.scope}`}>{s.scope}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )
                          }
                        </div>
                      )}

                      {/* PYTHON */}
                      {activeTab === 'python' && (
                        <pre className="demo-code-output">
                          {generado.python || '# Sin código generado'}
                        </pre>
                      )}

                      {/* JAVASCRIPT */}
                      {activeTab === 'javascript' && (
                        <pre className="demo-code-output">
                          {generado.javascript || '// Sin código generado'}
                        </pre>
                      )}

                      {/* C# */}
                      {activeTab === 'csharp' && (
                        <pre className="demo-code-output">
                          {generado.csharp || '// Sin código generado'}
                        </pre>
                      )}

                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
