import { useState } from 'react';
import { buscarSemantico } from '../services/busquedaService';

export default function BuscadorPage() {
  const [consulta, setConsulta] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);

  const ejecutarBusqueda = async (e) => {
    e.preventDefault();
    if (!consulta.trim()) return;
    setBuscando(true);
    setError('');
    try {
      const data = await buscarSemantico(consulta.trim(), 10);
      setResultados(data);
      setBuscado(true);
    } catch {
      setError('No se pudo realizar la búsqueda. Verifica la conexión.');
    } finally {
      setBuscando(false);
    }
  };

  const resaltarTexto = (texto, palabraClave) => {
    if (!palabraClave.trim() || !texto) return texto;
    const partes = texto.split(new RegExp(`(${palabraClave})`, 'gi'));
    return partes.map((parte, i) =>
      parte.toLowerCase() === palabraClave.toLowerCase()
        ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{parte}</mark>
        : parte
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Búsqueda Semántica</h1>

        <form onSubmit={ejecutarBusqueda} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Describe el tema que buscas..."
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={buscando || !consulta.trim()}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {buscando ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {buscado && !buscando && (
          <p className="text-sm text-gray-500 mb-4">
            {resultados.length === 0
              ? 'No se encontraron resultados para esta consulta.'
              : `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''} encontrado${resultados.length !== 1 ? 's' : ''}`}
          </p>
        )}

        <div className="space-y-4">
          {resultados.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition border border-gray-100">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h4 className="text-base font-semibold text-indigo-700">
                  {resaltarTexto(doc.titulo, consulta)}
                </h4>
                {doc.similitud != null && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                    {Math.round(doc.similitud * 100)}% similitud
                  </span>
                )}
              </div>

              {doc.resumen && (
                <p className="text-sm text-gray-600 mb-3">
                  {resaltarTexto(doc.resumen, consulta)}
                </p>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {doc.anioPublicacion && (
                  <span className="bg-gray-100 px-2 py-1 rounded">Año: {doc.anioPublicacion}</span>
                )}
                {doc.facultad && (
                  <span className="bg-gray-100 px-2 py-1 rounded">Facultad: {doc.facultad}</span>
                )}
                {doc.linea && (
                  <span className="bg-gray-100 px-2 py-1 rounded">Línea: {doc.linea}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {!buscado && !buscando && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Ingresa una consulta para buscar trabajos de grado</p>
            <p className="text-sm mt-2">La búsqueda semántica encuentra resultados por significado, no solo por palabras exactas</p>
          </div>
        )}
      </div>
    </div>
  );
}
