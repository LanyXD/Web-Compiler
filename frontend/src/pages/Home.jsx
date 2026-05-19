import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-ornament">⚔</div>
        <h1 className="home-title">Compilador NPC AAA</h1>
        <p className="home-tagline">
          Lenguaje para la Definición de Comportamientos de NPCs<br />
          y Eventos de Mundo
        </p>

        <div className="home-meta">
          <div className="meta-item">
            <span className="meta-label">Integrantes</span>
            <span className="meta-value">Ricardo Arturo Feliz Alva · Andy Isaac Monzón López</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Docente</span>
            <span className="meta-value">Ing. Jorge Tello</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Curso</span>
            <span className="meta-value">Compiladores · Universidad Rafael Landívar · 2026</span>
          </div>
        </div>

        <div className="home-actions">
          <Link to="/introduccion" className="btn">
            Explorar el proyecto
          </Link>
          <Link to="/demo" className="btn btn-outline">
            ⚔ Probar el compilador
          </Link>
        </div>
      </div>

      <div className="home-phases">
        <div className="divider">Fases del compilador</div>
        <div className="phases-grid">
          {[
            { num: '01', title: 'Léxico',     desc: 'Tokenización del código fuente',           to: '/lexico' },
            { num: '02', title: 'Sintáctico', desc: 'Construcción del árbol sintáctico',         to: '/sintactico' },
            { num: '03', title: 'Semántico',  desc: 'Validación de lógica y tipos',              to: '/semantico' },
            { num: '04', title: 'Símbolos',   desc: 'Tabla de identificadores y sus atributos',  to: '/simbolos' },
            { num: '05', title: 'Generación', desc: 'Traducción a Python, JS y C#',              to: '/generacion' },
          ].map((p) => (
            <Link key={p.num} to={p.to} className="phase-card">
              <span className="phase-num">{p.num}</span>
              <h3 className="phase-title">{p.title}</h3>
              <p className="phase-desc">{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
