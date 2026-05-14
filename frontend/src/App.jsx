import { useState, useRef } from "react";

const API_URL = "http://localhost:8000";

const EXAMPLES = {
  "Hola Mundo": `escribir("¡Hola, Mundo!")`,
  "Variables": `x = 10\ny = 3\nescribir(x + y)`,
  "Condicional": `edad = 20\nsi edad >= 18:\n    escribir("Mayor de edad")\nsino:\n    escribir("Menor de edad")`,
  "Bucle mientras": `i = 0\nmientras i < 5:\n    escribir(i)\n    i = i + 1`,
  "Función": `funcion cuadrado(n):\n    retornar n * n\n\nresultado = cuadrado(7)\nescribir(resultado)`,
  "Fibonacci": `funcion fib(n):\n    si n <= 1:\n        retornar n\n    retornar fib(n - 1) + fib(n - 2)\n\nescribir(fib(10))`,
};

function CompilerDemo() {
  const [code, setCode] = useState(EXAMPLES["Hola Mundo"]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("salida");
  const [codeLang, setCodeLang] = useState("python");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const lines = code.split("\n").length;

  const compilar = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/compilar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: code }),
      });
      const data = await res.json();
      setResult(data);
      setActiveTab(data.error ? "error" : "salida");
    } catch (err) {
      setResult({
        error: {
          error: "Sin conexión al servidor",
          detalle: "¿Está corriendo FastAPI en localhost:8000?",
          solucion: "uvicorn main_api:app --reload --port 8000",
          linea: 0,
        },
      });
      setActiveTab("error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      compilar();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target;
      const s = el.selectionStart;
      const newVal = code.substring(0, s) + "    " + code.substring(el.selectionEnd);
      setCode(newVal);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 4; });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(result?.generado?.[codeLang] ?? "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const tokens = result?.tokens ?? [];
  const salida = result?.salida ?? [];
  const simbolos = result?.simbolos ?? [];

  const TABS = [
    { id: "salida", label: "Salida", count: salida.length },
    { id: "tokens", label: "Tokens", count: tokens.length },
    { id: "simbolos", label: "Símbolos", count: simbolos.length },
    { id: "codigo", label: "Código generado" },
    result?.error ? { id: "error", label: "Error", err: true } : null,
  ].filter(Boolean);

  return (
    <div style={s.demoWrap}>
      {/* EDITOR */}
      <div style={s.editorCol}>
        <div style={s.panelBar}>
          <span style={s.panelLabel}>Editor · EduLang</span>
          <select
            style={s.select}
            onChange={(e) => { setCode(EXAMPLES[e.target.value]); e.target.value = ""; }}
            defaultValue=""
          >
            <option value="" disabled>Ejemplos…</option>
            {Object.keys(EXAMPLES).map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>

        <div style={s.editorArea}>
          <div style={s.lineNums}>
            {Array.from({ length: lines }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            style={s.textarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
          />
        </div>

        <div style={s.runBar}>
          <button style={s.btnRun} onClick={compilar} disabled={loading}>
            {loading ? "⟳ Compilando…" : "▶  Compilar"}
          </button>
          <button style={s.btnClear} onClick={() => { setCode(""); setResult(null); }}>
            Limpiar
          </button>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#888", fontFamily: "monospace" }}>
            Ctrl+Enter
          </span>
        </div>
      </div>

      {/* RESULTS */}
      <div style={s.resultsCol}>
        <div style={s.tabBar}>
          {TABS.map((t) => (
            <button
              key={t.id}
              style={{
                ...s.tab,
                ...(activeTab === t.id ? s.tabActive : {}),
                ...(t.err ? s.tabErr : {}),
              }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {t.count > 0 && <span style={s.tabCount}>{t.count}</span>}
            </button>
          ))}
        </div>

        <div style={s.tabContent}>
          {!result && (
            <div style={s.empty}>
              <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>⚙</div>
              <p style={{ color: "#888", fontSize: 13 }}>
                Escribe código y presiona <strong>Compilar</strong>
              </p>
            </div>
          )}

          {/* SALIDA */}
          {result && !result.error && activeTab === "salida" && (
            <div style={s.outputArea}>
              {salida.length === 0
                ? <span style={{ color: "#888", fontStyle: "italic", fontSize: 13 }}>(sin salida)</span>
                : salida.map((line, i) => (
                  <div key={i} style={s.outputLine}>
                    <span style={s.outputIdx}>{i + 1}</span>
                    <span style={s.outputVal}>{line}</span>
                  </div>
                ))
              }
            </div>
          )}

          {/* TOKENS */}
          {result && !result.error && activeTab === "tokens" && (
            <table style={s.table}>
              <thead>
                <tr>
                  {["#", "Tipo", "Valor", "Línea"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokens.map((t, i) => (
                  <tr key={i}>
                    <td style={s.td}>{i + 1}</td>
                    <td style={s.td}><span style={{ ...s.badge, ...tokenColor(t.tipo) }}>{t.tipo}</span></td>
                    <td style={{ ...s.td, fontFamily: "monospace", fontSize: 12 }}>{t.valor}</td>
                    <td style={{ ...s.td, color: "#888" }}>{t.linea}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* SÍMBOLOS */}
          {result && !result.error && activeTab === "simbolos" && (
            simbolos.length === 0
              ? <div style={s.empty}><p style={{ color: "#888", fontSize: 13 }}>No hay variables en el scope global</p></div>
              : <table style={s.table}>
                <thead>
                  <tr>
                    {["Nombre", "Tipo", "Valor", "Línea"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {simbolos.map((sym, i) => (
                    <tr key={i}>
                      <td style={{ ...s.td, color: "#82aaff", fontFamily: "monospace" }}>{sym.nombre}</td>
                      <td style={{ ...s.td, color: "#c792ea" }}>{sym.tipo}</td>
                      <td style={{ ...s.td, color: "#f78c6c", fontFamily: "monospace" }}>{sym.valor}</td>
                      <td style={{ ...s.td, color: "#888" }}>{sym.linea}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          )}

          {/* CÓDIGO GENERADO */}
          {result && !result.error && activeTab === "codigo" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={s.langBar}>
                {["python", "javascript", "csharp"].map((lang) => (
                  <button
                    key={lang}
                    style={{ ...s.langBtn, ...(codeLang === lang ? s.langBtnActive : {}) }}
                    onClick={() => setCodeLang(lang)}
                  >
                    {{ python: "🐍 Python", javascript: "📜 JavaScript", csharp: "🔷 C#" }[lang]}
                  </button>
                ))}
                <button style={s.copyBtn} onClick={copyCode}>
                  {copied ? "✓ Copiado" : "⧉ Copiar"}
                </button>
              </div>
              <pre style={s.codeBlock}>{result?.generado?.[codeLang] ?? ""}</pre>
            </div>
          )}

          {/* ERROR */}
          {result?.error && activeTab === "error" && (
            <div style={s.errorBox}>
              <div style={s.errorTitle}>✗ {result.error.error}</div>
              {result.error.linea > 0 && (
                <div style={s.errorRow}><span style={s.errorLabel}>Línea:</span>{result.error.linea}</div>
              )}
              <div style={s.errorRow}><span style={s.errorLabel}>Detalle:</span>{result.error.detalle}</div>
              <div style={s.errorHint}>💡 {result.error.solucion}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function tokenColor(tipo) {
  const map = {
    PALABRA_RESERVADA: { background: "rgba(199,146,234,0.15)", color: "#c792ea" },
    IDENTIFICADOR: { background: "rgba(130,170,255,0.15)", color: "#82aaff" },
    NUMERO: { background: "rgba(247,140,108,0.15)", color: "#f78c6c" },
    CADENA: { background: "rgba(173,219,103,0.15)", color: "#addb67" },
    OPERADOR: { background: "rgba(137,221,255,0.15)", color: "#89ddff" },
  };
  return map[tipo] ?? { background: "rgba(90,250,141,0.1)", color: "#5afa8d" };
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function App() {
  const navLinks = [
    { href: "#intro", label: "Inicio" },
    { href: "#lenguaje", label: "Lenguaje" },
    { href: "#lexico", label: "Léxico" },
    { href: "#sintactico", label: "Sintáctico" },
    { href: "#semantico", label: "Semántico" },
    { href: "#npc", label: "NPC" },
    { href: "#demo", label: "Demo" },
  ];

  return (
    <div style={s.page}>
      {/* HEADER */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div>
            <h1 style={s.h1}>Compilador NPC AAA</h1>
            <p style={s.headerSub}>Lenguajes Formales y de Programación · Arturo Alva & Landy Monzón</p>
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} style={s.navLink}
              onMouseEnter={(e) => e.target.style.color = "#5afa8d"}
              onMouseLeave={(e) => e.target.style.color = "#aaa"}
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <main style={s.main}>

        <section id="intro" style={s.section}>
          <h2 style={s.h2}>Introducción</h2>
          <p style={s.p}>
            Este proyecto implementa un compilador completo con análisis léxico,
            sintáctico y semántico, incluyendo una extensión para NPCs.
            El lenguaje se llama <strong style={{ color: "#5afa8d" }}>EduLang</strong> y está diseñado
            en español para facilitar el aprendizaje de programación.
          </p>
        </section>

        <section id="lenguaje" style={s.section}>
          <h2 style={s.h2}>Lenguaje</h2>
          <p style={s.p}>EduLang usa sintaxis basada en indentación, con palabras clave en español:</p>
          <pre style={s.pre}>{`x = 10
si x > 5:
    escribir(x)

funcion sumar(a, b):
    retornar a + b`}</pre>
        </section>

        <section id="lexico" style={s.section}>
          <h2 style={s.h2}>Fase Léxica</h2>
          <p style={s.p}>
            El código fuente se convierte en una secuencia de <strong>tokens</strong>.
            El lexer reconoce palabras reservadas, identificadores, números, cadenas, operadores y símbolos.
          </p>
          <div style={s.tokenGrid}>
            {[
              { tipo: "PALABRA_RESERVADA", ejemplos: "si, sino, mientras, escribir, funcion, retornar, para" },
              { tipo: "IDENTIFICADOR", ejemplos: "x, contador, resultado, nombre" },
              { tipo: "NUMERO", ejemplos: "0, 42, 100, 3" },
              { tipo: "CADENA", ejemplos: '"hola", "EduLang"' },
              { tipo: "OPERADOR", ejemplos: "=, +, -, *, /, ==, !=, <, >" },
              { tipo: "SIMBOLO", ejemplos: "( ) [ ] : ," },
            ].map((t) => (
              <div key={t.tipo} style={s.tokenCard}>
                <span style={{ ...s.badge, ...tokenColor(t.tipo), marginBottom: 6, display: "inline-block" }}>{t.tipo}</span>
                <p style={{ fontSize: 12, color: "#aaa", margin: 0, fontFamily: "monospace" }}>{t.ejemplos}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="sintactico" style={s.section}>
          <h2 style={s.h2}>Fase Sintáctica</h2>
          <p style={s.p}>
            El parser toma la secuencia de tokens y construye un <strong>Árbol de Sintaxis Abstracta (AST)</strong>.
            Valida que la estructura del programa sea correcta según la gramática de EduLang.
          </p>
          <pre style={s.pre}>{`Programa
└── If
    ├── condicion: BinOp(x > 5)
    └── cuerpo:
        └── Escribir(x)`}</pre>
        </section>

        <section id="semantico" style={s.section}>
          <h2 style={s.h2}>Fase Semántica</h2>
          <p style={s.p}>
            El analizador semántico recorre el AST, valida tipos, resuelve variables en su scope
            y ejecuta el programa manteniendo una tabla de símbolos. También genera código
            equivalente en Python, JavaScript y C#.
          </p>
        </section>

        <section id="npc" style={s.section}>
          <h2 style={s.h2}>Lenguaje NPC</h2>
          <p style={s.p}>Extensión del lenguaje para definir comportamiento de personajes no jugables:</p>
          <pre style={s.pre}>{`npc guardia:
    hablar("Guardia", "¡Alto! ¿Quién va?")
    ejecutar("patrullar")`}</pre>
        </section>

        {/* DEMO SECTION */}
        <section id="demo" style={{ ...s.section, maxWidth: "100%" }}>
          <h2 style={s.h2}>Demo interactivo</h2>
          <p style={s.p}>
            Prueba el compilador en tiempo real. Escribe código EduLang, presiona{" "}
            <kbd style={s.kbd}>Compilar</kbd> y observa los tokens, el AST, la tabla de símbolos
            y el código generado en Python, JavaScript o C#.
          </p>
          <CompilerDemo />
        </section>

        <section style={s.section}>
          <h2 style={s.h2}>Repositorio</h2>
          <p style={s.p}>El código fuente completo está disponible en GitHub:</p>
          <a
            href="https://github.com/ArtuIVO/Proyecto-de-lenguaje-compilador"
            target="_blank"
            rel="noreferrer"
            style={s.repoLink}
          >
            github.com/ArtuIVO/Proyecto-de-lenguaje-compilador →
          </a>
        </section>
      </main>

      <footer style={s.footer}>
        <p>Compilador NPC AAA · Arturo Alva & Landy Monzón · Compiladores</p>
      </footer>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  page: { minHeight: "100vh", background: "#0a0c10", color: "#e8ecf4", fontFamily: "'Segoe UI', system-ui, sans-serif" },

  header: { background: "#111318", borderBottom: "1px solid #1e2230", padding: "28px 0" },
  headerInner: { maxWidth: 900, margin: "0 auto", padding: "0 24px" },
  h1: { fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: -0.5 },
  headerSub: { color: "#888", fontSize: 13, margin: "6px 0 0", },

  nav: { background: "#0e1016", borderBottom: "1px solid #1e2230", position: "sticky", top: 0, zIndex: 10 },
  navInner: { maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0 },
  navLink: { padding: "12px 16px", color: "#aaa", textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "color 0.15s", display: "block" },

  main: { maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" },

  section: { padding: "52px 0", borderBottom: "1px solid #1a1d26" },
  h2: { fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" },
  p: { fontSize: 15, lineHeight: 1.75, color: "#bbb", marginBottom: 16 },

  pre: {
    background: "#111318", border: "1px solid #1e2230", borderRadius: 8,
    padding: "16px 20px", fontFamily: "monospace", fontSize: 13,
    lineHeight: 1.8, color: "#addb67", overflowX: "auto",
  },

  tokenGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginTop: 8 },
  tokenCard: { background: "#111318", border: "1px solid #1e2230", borderRadius: 8, padding: "12px 16px" },

  badge: { display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, fontFamily: "monospace" },

  kbd: { background: "#1e2230", border: "1px solid #333", borderRadius: 4, padding: "2px 8px", fontFamily: "monospace", fontSize: 12, color: "#5afa8d" },

  repoLink: { color: "#5afa8d", fontSize: 14, fontFamily: "monospace", textDecoration: "none" },

  footer: { textAlign: "center", padding: "24px", color: "#555", fontSize: 12, borderTop: "1px solid #1e2230" },

  // ── DEMO ──
  demoWrap: { display: "flex", gap: 0, border: "1px solid #1e2230", borderRadius: 10, overflow: "hidden", height: 480, marginTop: 24 },

  editorCol: { display: "flex", flexDirection: "column", width: "48%", borderRight: "1px solid #1e2230" },
  resultsCol: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },

  panelBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#111318", borderBottom: "1px solid #1e2230", flexShrink: 0 },
  panelLabel: { fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#666" },
  select: { background: "#0a0c10", border: "1px solid #1e2230", color: "#ccc", fontSize: 11, padding: "3px 8px", borderRadius: 4, fontFamily: "monospace", outline: "none", cursor: "pointer" },

  editorArea: { flex: 1, display: "flex", overflow: "auto", background: "#0d0f14" },
  lineNums: { fontFamily: "monospace", fontSize: 12, lineHeight: "22px", padding: "14px 10px 14px 14px", color: "#444", textAlign: "right", userSelect: "none", background: "#111318", borderRight: "1px solid #1e2230", minWidth: 44, flexShrink: 0 },
  textarea: { flex: 1, fontFamily: "monospace", fontSize: 13, lineHeight: "22px", padding: 14, background: "transparent", color: "#e8ecf4", border: "none", outline: "none", resize: "none", caretColor: "#5afa8d", tabSize: 4 },

  runBar: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#111318", borderTop: "1px solid #1e2230", flexShrink: 0 },
  btnRun: { padding: "6px 16px", background: "#5afa8d", color: "#000", border: "none", borderRadius: 5, fontWeight: 700, fontSize: 12, cursor: "pointer" },
  btnClear: { padding: "6px 12px", background: "transparent", color: "#888", border: "1px solid #1e2230", borderRadius: 5, fontSize: 12, cursor: "pointer" },

  tabBar: { display: "flex", background: "#111318", borderBottom: "1px solid #1e2230", overflowX: "auto", flexShrink: 0 },
  tab: { padding: "8px 14px", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#666", cursor: "pointer", background: "transparent", border: "none", borderBottom: "2px solid transparent", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" },
  tabActive: { color: "#5afa8d", borderBottomColor: "#5afa8d" },
  tabErr: { color: "#fa5a8d" },
  tabCount: { background: "rgba(90,250,141,0.12)", color: "#5afa8d", borderRadius: 10, padding: "1px 5px", fontSize: 9 },

  tabContent: { flex: 1, overflow: "auto" },

  empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" },

  outputArea: { padding: 14, fontFamily: "monospace", fontSize: 13, lineHeight: 1.8 },
  outputLine: { display: "flex", gap: 12, paddingBottom: 4, borderBottom: "1px solid #1a1d26", marginBottom: 4 },
  outputIdx: { color: "#555", fontSize: 11, width: 20, flexShrink: 0 },
  outputVal: { color: "#5afa8d" },

  table: { width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" },
  th: { textAlign: "left", padding: "8px 14px", color: "#666", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #1e2230", background: "#111318", position: "sticky", top: 0, fontFamily: "system-ui" },
  td: { padding: "6px 14px", borderBottom: "1px solid #13151c", color: "#ccc" },

  langBar: { display: "flex", gap: 4, padding: "8px 12px", background: "#111318", borderBottom: "1px solid #1e2230", alignItems: "center", flexShrink: 0 },
  langBtn: { padding: "3px 10px", background: "transparent", border: "1px solid #1e2230", borderRadius: 4, color: "#888", fontSize: 11, cursor: "pointer", fontFamily: "monospace" },
  langBtnActive: { background: "rgba(90,141,250,0.1)", color: "#5a8dfa", borderColor: "rgba(90,141,250,0.3)" },
  copyBtn: { marginLeft: "auto", padding: "3px 10px", background: "transparent", border: "1px solid #1e2230", borderRadius: 4, color: "#888", fontSize: 11, cursor: "pointer" },
  codeBlock: { padding: 14, fontFamily: "monospace", fontSize: 12, lineHeight: 1.8, color: "#abb2bf", whiteSpace: "pre", flex: 1, margin: 0, overflow: "auto" },

  errorBox: { margin: 14, padding: 16, background: "rgba(250,90,141,0.05)", border: "1px solid rgba(250,90,141,0.2)", borderLeft: "3px solid #fa5a8d", borderRadius: 6 },
  errorTitle: { color: "#fa5a8d", fontWeight: 700, fontSize: 14, marginBottom: 10 },
  errorRow: { display: "flex", gap: 8, fontSize: 12, fontFamily: "monospace", marginBottom: 4, color: "#ccc" },
  errorLabel: { color: "#888", width: 65, flexShrink: 0 },
  errorHint: { marginTop: 10, fontSize: 12, color: "#fa5a8d", fontStyle: "italic" },
};