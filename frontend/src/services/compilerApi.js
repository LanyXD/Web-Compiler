const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Envía código al compilador y retorna el resultado completo.
 * @param {string} codigo - Código fuente EduLang
 * @returns {Promise<object>} - { exito, tokens, salida, simbolos, generado, error }
 */
export async function compilarCodigo(codigo) {
  const res = await fetch(`${API_URL}/api/compilar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo }),
  })

  if (!res.ok) {
    throw new Error(`Error del servidor: ${res.status}`)
  }

  return res.json()
}
