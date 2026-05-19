import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-divider">✦ ✦ ✦</div>
        <p className="footer-text">
          Compilador NPC AAA · Ricardo Arturo Feliz Alva & Andy Isaac Monzón López
        </p>
        <p className="footer-sub">
          Compiladores · Universidad Rafael Landívar · 2026
        </p>
        <a
          href="https://github.com/ArtuIVO/Proyecto-de-lenguaje-compilador"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          Ver repositorio en GitHub →
        </a>
      </div>
    </footer>
  )
}
