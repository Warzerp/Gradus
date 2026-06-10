import { useState, useEffect, useCallback } from 'react';
import * as autorService from '../services/autorService';

export default function GestionAutores() {
  const [autores, setAutores] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [paginaActual, setPaginaActual] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [autorSeleccionado, setAutorSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cargarAutores = useCallback(async (pagina = 0) => {
    setLoading(true);
    setError('');
    try {
      const data = await autorService.listarAutores(pagina, 10);
      setAutores(data.content);
      setTotalPages(data.totalPages);
      setPaginaActual(data.number);
    } catch {
      setError('No se pudieron cargar los autores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarAutores(0); }, [cargarAutores]);

  const abrirEditar = (autor) => {
    setAutorSeleccionado({ ...autor });
    setModalAbierto(true);
  };

  const abrirNuevo = () => {
    setAutorSeleccionado({ nombre: '', apellido: '', email: '', programaId: '' });
    setModalAbierto(true);
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      const payload = {
        nombre: autorSeleccionado.nombre,
        apellido: autorSeleccionado.apellido,
        email: autorSeleccionado.email || undefined,
        programaId: autorSeleccionado.programaId || undefined,
      };
      if (autorSeleccionado.id) {
        await autorService.actualizarAutor(autorSeleccionado.id, payload);
      } else {
        await autorService.crearAutor(payload);
      }
      setModalAbierto(false);
      cargarAutores(paginaActual);
    } catch {
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const aplicarBaja = async (id) => {
    if (!window.confirm('¿Desactivar este autor?')) return;
    try {
      await autorService.desactivarAutor(id);
      cargarAutores(paginaActual);
    } catch {
      setError('Error al desactivar el autor.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Autores</h1>
        <button
          onClick={abrirNuevo}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Nuevo Autor
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apellido</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Cargando...</td></tr>
            ) : autores.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No hay autores registrados.</td></tr>
            ) : autores.map((autor) => (
              <tr key={autor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{autor.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{autor.apellido}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{autor.email || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    autor.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {autor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button
                    onClick={() => abrirEditar(autor)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium hover:bg-indigo-200"
                  >
                    Editar
                  </button>
                  {autor.activo && (
                    <button
                      onClick={() => aplicarBaja(autor.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200"
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={() => cargarAutores(paginaActual - 1)}
              disabled={paginaActual === 0}
              className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200"
            >
              ← Anterior
            </button>
            <span className="text-sm text-gray-500">Página {paginaActual + 1} de {totalPages}</span>
            <button
              onClick={() => cargarAutores(paginaActual + 1)}
              disabled={paginaActual + 1 >= totalPages}
              className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {autorSeleccionado?.id ? 'Editar Autor' : 'Nuevo Autor'}
            </h2>
            <form onSubmit={guardarCambios} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    required
                    value={autorSeleccionado?.nombre || ''}
                    onChange={e => setAutorSeleccionado({ ...autorSeleccionado, nombre: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    required
                    value={autorSeleccionado?.apellido || ''}
                    onChange={e => setAutorSeleccionado({ ...autorSeleccionado, apellido: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={autorSeleccionado?.email || ''}
                  onChange={e => setAutorSeleccionado({ ...autorSeleccionado, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                >
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
