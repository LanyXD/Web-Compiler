import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home         from './pages/Home/Home'
import Introduction from './pages/Introduction/Introduction'
import Language     from './pages/Language/Language'
import Lexer        from './pages/Lexer/Lexer'
import Parser       from './pages/Parser/Parser'
import Semantic     from './pages/Semantic/Semantic'
import Symbols      from './pages/Symbols/Symbols'
import CodeGen      from './pages/CodeGen/CodeGen'
import Demo         from './pages/Demo/Demo'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/introduccion" element={<Introduction />} />
        <Route path="/lenguaje"    element={<Language />} />
        <Route path="/lexico"      element={<Lexer />} />
        <Route path="/sintactico"  element={<Parser />} />
        <Route path="/semantico"   element={<Semantic />} />
        <Route path="/simbolos"    element={<Symbols />} />
        <Route path="/generacion"  element={<CodeGen />} />
        <Route path="/demo"        element={<Demo />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
