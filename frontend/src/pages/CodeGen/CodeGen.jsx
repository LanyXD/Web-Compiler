import './CodeGen.css'

const TRANSLATIONS = [
  {
    constructs: 'Asignación',
    edulang:    'x = 5',
    python:     'x = 5',
    javascript: 'let x = 5;',
    csharp:     'var x = 5;',
  },
  {
    constructs: 'Declaración tipada',
    edulang:    'entero x = 5',
    python:     'x: int = 5',
    javascript: 'let x = 5;',
    csharp:     'int x = 5;',
  },
  {
    constructs: 'Imprimir',
    edulang:    'escribir(x)',
    python:     'print(x)',
    javascript: 'console.log(x);',
    csharp:     'Console.WriteLine(x);',
  },
  {
    constructs: 'Condicional',
    edulang:    'si cond:\n    ...\nsino:\n    ...',
    python:     'if cond:\n    ...\nelse:\n    ...',
    javascript: 'if (cond) {\n    ...\n} else {\n    ...\n}',
    csharp:     'if (cond) {\n    ...\n} else {\n    ...\n}',
  },
  {
    constructs: 'Bucle mientras',
    edulang:    'mientras cond:\n    ...',
    python:     'while cond:\n    ...',
    javascript: 'while (cond) {\n    ...\n}',
    csharp:     'while (cond) {\n    ...\n}',
  },
  {
    constructs: 'Bucle para',
    edulang:    'para i en rango(0, 5):\n    ...',
    python:     'for i in range(0, 5):\n    ...',
    javascript: 'for (let i = 0; i < 5; i++) {\n    ...\n}',
    csharp:     'for (int i = 0; i < 5; i++) {\n    ...\n}',
  },
  {
    constructs: 'Función',
    edulang:    'funcion f(a, b):\n    retornar a + b',
    python:     'def f(a, b):\n    return a + b',
    javascript: 'function f(a, b) {\n    return a + b;\n}',
    csharp:     'static dynamic f(dynamic a, dynamic b) {\n    return a + b;\n}',
  },
  {
    constructs: 'Lógico Y / O / NO',
    edulang:    'x y y\nx o y\nno x',
    python:     'x and y\nx or y\nnot x',
    javascript: 'x && y\nx || y\n!x',
    csharp:     'x && y\nx || y\n!x',
  },
  {
    constructs: 'Nulo',
    edulang:    'nulo',
    python:     'None',
    javascript: 'null',
    csharp:     'null',
  },
  {
    constructs: 'Romper / Continuar',
    edulang:    'romper\ncontinuar',
    python:     'break\ncontinue',
    javascript: 'break;\ncontinue;',
    csharp:     'break;\ncontinue;',
  },
]

const EXAMPLE_INPUT = `funcion suma(a, b):
    retornar a + b

entero x = 10
entero y = 20
resultado = suma(x, y)

si resultado > 25:
    escribir("Mayor a 25")
sino:
    escribir("Menor o igual")`

const EXAMPLE_PYTHON = `def suma(a, b):
    return a + b

x: int = 10
y: int = 20
resultado = suma(x, y)

if resultado > 25:
    print('Mayor a 25')
else:
    print('Menor o igual')`

const EXAMPLE_JS = `function suma(a, b) {
    return a + b;
}

let x = 10;
let y = 20;
let resultado = suma(x, y);

if (resultado > 25) {
    console.log('Mayor a 25');
} else {
    console.log('Menor o igual');
}`

const EXAMPLE_CS = `using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        int x = 10;
        int y = 20;
        var resultado = suma(x, y);

        if (resultado > 25) {
            Console.WriteLine("Mayor a 25");
        } else {
            Console.WriteLine("Menor o igual");
        }
    }

    static dynamic suma(dynamic a, dynamic b)
    {
        return a + b;
    }
}`

const TARGET_CARDS = [
  {
    lang: 'Python',
    color: 'blue',
    puntos: [
      'Indentación equivalente — transición natural desde el lenguaje fuente',
      'Declaraciones tipadas emiten anotaciones de tipo (x: int = 5)',
      'Operadores lógicos: y → and, o → or, no → not',
      'Builtins traducidos: largo → len, mayus → str.upper, ordenar → sorted',
    ],
  },
  {
    lang: 'JavaScript',
    color: 'orange',
    puntos: [
      'Variables emiten let en la primera asignación, luego se reusan',
      'Bloques delimitados con llaves { }',
      'Operadores lógicos: y → &&, o → ||, no → !',
      'Función escribir traducida a console.log()',
    ],
  },
  {
    lang: 'C#',
    color: 'green',
    puntos: [
      'Código envuelto en class Program / static void Main()',
      'Tipos estáticos donde son conocidos (int, string, bool)',
      'Variables sin tipo declaradas como var o dynamic',
      'Función escribir traducida a Console.WriteLine()',
    ],
  },
]

export default function CodeGen() {
  return (
    <div className="page">
      <div className="container">

        <section className="section">
          <h2 className="section-title">Fase 4 — Generación de Código</h2>
          <p className="section-subtitle">Traducción del AST validado a código ejecutable</p>
          <p>
            El generador de código recorre el AST producido y validado por las fases anteriores
            y emite código en el <strong>lenguaje objetivo</strong> seleccionado. El compilador
            soporta tres backends: <strong>Python</strong>, <strong>JavaScript</strong> y{' '}
            <strong>C#</strong>.
          </p>
          <p>
            Cada generador implementa un método por tipo de nodo del AST. La transformación es
            directa — el árbol se convierte a texto del lenguaje destino preservando la semántica
            verificada. No hay representaciones intermedias adicionales.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Lenguajes objetivo</h2>
          <p className="section-subtitle">Tres backends con sus características de traducción</p>

          <div className="gen-targets">
            {TARGET_CARDS.map((t) => (
              <div key={t.lang} className={`gen-target-card ${t.color}`}>
                <h3 className="gen-target-title">{t.lang}</h3>
                <ul className="gen-target-list">
                  {t.puntos.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Tabla de traducciones</h2>
          <p className="section-subtitle">Correspondencia construcción por construcción entre los cuatro lenguajes</p>

          <div className="gen-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Construcción</th>
                  <th>EduLang</th>
                  <th>Python</th>
                  <th>JavaScript</th>
                  <th>C#</th>
                </tr>
              </thead>
              <tbody>
                {TRANSLATIONS.map((t) => (
                  <tr key={t.constructs}>
                    <td style={{ fontFamily: 'var(--font-title)', fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {t.constructs}
                    </td>
                    <td><pre className="gen-mini-code">{t.edulang}</pre></td>
                    <td><pre className="gen-mini-code">{t.python}</pre></td>
                    <td><pre className="gen-mini-code">{t.javascript}</pre></td>
                    <td><pre className="gen-mini-code">{t.csharp}</pre></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Ejemplo completo</h2>
          <p className="section-subtitle">El mismo programa traducido a los tres lenguajes objetivo</p>

          <div className="gen-example-grid">
            <div>
              <p className="gen-label">EduLang (entrada)</p>
              <pre className="code-block">{EXAMPLE_INPUT}</pre>
            </div>
            <div>
              <p className="gen-label">Python</p>
              <pre className="code-block">{EXAMPLE_PYTHON}</pre>
            </div>
            <div>
              <p className="gen-label">JavaScript</p>
              <pre className="code-block">{EXAMPLE_JS}</pre>
            </div>
            <div>
              <p className="gen-label">C#</p>
              <pre className="code-block">{EXAMPLE_CS}</pre>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
