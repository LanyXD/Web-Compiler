import { NavLink } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/',             label: 'Inicio' },
  { to: '/introduccion', label: 'Introducción' },
  { to: '/lenguaje',     label: 'Lenguaje' },
  { to: '/lexico',       label: 'Léxico' },
  { to: '/sintactico',   label: 'Sintáctico' },
  { to: '/semantico',    label: 'Semántico' },
  { to: '/simbolos',     label: 'Símbolos' },
  { to: '/generacion',   label: 'Generación' },
  { to: '/demo',         label: '⚔ Demo' },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo">NPC AAA</span>
        <ul className="navbar-links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
