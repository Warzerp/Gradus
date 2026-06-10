import React, { useState } from 'react';

export default function GestionAutores() {
  // 1. Estado para la lista de autores (Simulados)
  const [autores, setAutores] = useState([
    { id: 1, nombre: "Luis Gelvez", documento: "10023456", estado: "Activo" },
    { id: 2, nombre: "Carlos Mendoza", documento: "10078912", estado: "Activo" },
    { id: 3, nombre: "Ana Martinez", documento: "98765432", estado: "Inactivo" },
    { id: 4, nombre: "Diana Prada", documento: "10145678", estado: "Activo" },
  ]);

  // Estados para el control de la UI
  const [modalAbierto, setModalAbierto] = useState(false);
  const [autorSeleccionado, setAutorSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  // 2. Lógica de Paginación Simple (2 autores por página para el ejemplo)
  const autoresPorPagina = 2;
  const indiceUltimo = paginaActual * autoresPorPagina;
  const indicePrimero = indiceUltimo - autoresPorPagina;
  const autoresPaginados = autores.slice(indicePrimero, indiceUltimo);

  // 3. Función para abrir el modal de edición
  const abrirEditarModal = (autor) => {
    setAutorSeleccionado({ ...autor });
    setModalAbierto(true);
  };

  // 4. Función para guardar los cambios del modal
  const guardarCambios = (e) => {
    e.preventDefault();
    setAutores(autores.map(a => a.id === autorSeleccionado.id ? autorSeleccionado : a));
    setModalAbierto(false);
  };

  // 5. Criterio de Aceptación: Baja Lógica (Cambia estado a Inactivo)
  const aplicarBajaLogica = (id) => {
    setAutores(autores.map(autor => {
      if (autor.id === id) {
        return { ...autor, estado: "Inactivo" }; // No se borra, cambia de estado
      }
      return autor;
    }));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Autores</h1>

      {/* TABLA PAGINADA */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {autoresPaginados.map((autor) => (
              <tr key={autor.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{autor.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{autor.documento}</td>
                <td className="px-6 py-4 text-sm">
                  {/* Criterio: Muestra estado Inactivo en la UI */}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    autor.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {autor.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center space-x-2">
                  <button 
                    onClick={() => abrirEditarModal(autor)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition">
                    Editar
                  </button>
                  {autor.estado === "Activo" && (
                    <button 
                      onClick={() => aplicarBajaLogica(autor.id)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition">
                      Dar de Baja
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* CONTROLES DE PAGINACIÓN */}
        <div className="px-6 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200">
          <button 
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(prev => prev - 1)}
            className="px-3 py-1 bg-white border rounded text-sm disabled:opacity-50">
            Anterior
          </button>
          <span className="text-sm text-gray-700">Página {paginaActual}</span>
          <button 
            disabled={indiceUltimo >= autores.length}
            onClick={() => setPaginaActual(prev => prev + 1)}
            className="px-3 py-1 bg-white border rounded text-sm disabled:opacity-50">
            Siguiente
          </button>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">Editar Autor</h2>
            <form onSubmit={guardarCambios} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input 
                  type="text" 
                  value={autorSeleccionado.nombre}
                  onChange={(e) => setAutorSeleccionado({...autorSeleccionado, nombre: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Documento de Identidad</label>
                <input 
                  type="text" 
                  value={autorSeleccionado.documento}
                  onChange={(e) => setAutorSeleccionado({...autorSeleccionado, documento: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}