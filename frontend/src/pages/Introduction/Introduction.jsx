import './Introduction.css'

export default function Introduction() {
  return (
    <div className="page">
      <div className="container">

        {/* ── INTRO ─────────────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Introducción</h2>
          <p className="section-subtitle">¿Qué es este compilador y cuál es su propósito?</p>

          <p>
            Este proyecto consiste en el desarrollo de un compilador para un lenguaje de scripting
            diseñado específicamente para el entorno de los videojuegos. Su propósito es permitir
            que los diseñadores de niveles y narrativa puedan programar la lógica de comportamiento
            de personajes no jugables (NPCs) y la activación de eventos ambientales, sin necesidad
            de intervenir directamente en el código fuente del motor del juego.
          </p>
          <p>
            El lenguaje ofrece una sintaxis sencilla, comprensible y flexible, inspirada en Python
            y con palabras clave en español, lo que facilita su adopción por parte de equipos no
            especializados en programación de bajo nivel.
          </p>
        </section>

        {/* ── CONTEXTO ──────────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Contexto de uso</h2>
          <p className="section-subtitle">¿Dónde y quién lo usaría?</p>

          <p>
            El compilador está pensado para ser utilizado dentro de un estudio de desarrollo de
            videojuegos. Mientras los programadores del motor construyen la arquitectura base del
            sistema, los equipos de narrativa y diseño de misiones requieren una herramienta que
            les permita definir comportamientos, diálogos y eventos de forma autónoma.
          </p>

          <div className="card-grid">
            {[
              {
                icon: '📖',
                title: 'Diseñadores Narrativos',
                desc: 'Crean diálogos y decisiones que cambian según las acciones previas del jugador.',
              },
              {
                icon: '🗺',
                title: 'Diseñadores de Niveles',
                desc: 'Configuran trampas, enemigos, eventos cinemáticos y condiciones del mundo.',
              },
              {
                icon: '🔍',
                title: 'QA Testers',
                desc: 'Leen y verifican que las reglas de una misión se ejecuten según lo planeado.',
              },
            ].map((u) => (
              <div key={u.title} className="card intro-user-card">
                <span className="intro-icon">{u.icon}</span>
                <h3>{u.title}</h3>
                <p>{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── OBJETIVOS ─────────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Objetivos</h2>

          <ul className="intro-list">
            {[
              'Desarrollar una herramienta útil y funcional para diseñadores narrativos y de niveles.',
              'Facilitar la creación de comportamientos de NPCs y eventos del juego mediante un lenguaje especializado.',
              'Reducir la dependencia directa del equipo de programación para la implementación de lógica narrativa.',
              'Proporcionar una solución clara y escalable que permita integrar scripts dentro del motor del videojuego.',
            ].map((obj, i) => (
              <li key={i} className="intro-list-item">
                <span className="intro-list-num">0{i + 1}</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── TECNOLOGÍAS ───────────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Tecnologías utilizadas</h2>
          <p className="section-subtitle">Stack del proyecto</p>

          <div className="card-grid">
            {[
              { name: 'Python',   role: 'Lenguaje principal del compilador',         badge: 'Backend' },
              { name: 'PyQt6',    role: 'Interfaz gráfica de escritorio',             badge: 'Desktop' },
              { name: 'FastAPI',  role: 'API REST para exponer el compilador',        badge: 'API' },
              { name: 'React',    role: 'Sitio web informativo e interactivo',        badge: 'Frontend' },
            ].map((t) => (
              <div key={t.name} className="card intro-tech-card">
                <div className="intro-tech-header">
                  <span className="intro-tech-name">{t.name}</span>
                  <span className="badge badge-gold">{t.badge}</span>
                </div>
                <p>{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FUNCIONALIDADES ───────────────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">Funcionalidades principales</h2>

          <div className="intro-features">
            {[
              { icon: '🔤', label: 'Análisis léxico',     desc: 'Tokenización del código fuente carácter a carácter.' },
              { icon: '🌳', label: 'Análisis sintáctico', desc: 'Validación de la estructura gramatical del programa.' },
              { icon: '🧠', label: 'Análisis semántico',  desc: 'Verificación de coherencia lógica, tipos y ámbitos.' },
              { icon: '📋', label: 'Tabla de símbolos',   desc: 'Registro de identificadores, tipos, valores y scope.' },
              { icon: '⚙',  label: 'Generación de código',desc: 'Traducción a Python, JavaScript y C#.' },
              { icon: '🚨', label: 'Detección de errores',desc: 'Reporte preciso de errores léxicos, sintácticos y semánticos.' },
            ].map((f) => (
              <div key={f.label} className="intro-feature-item">
                <span className="intro-feature-icon">{f.icon}</span>
                <div>
                  <strong>{f.label}</strong>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
