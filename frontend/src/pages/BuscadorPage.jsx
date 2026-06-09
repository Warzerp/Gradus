import React, { useState, useEffect } from 'react';

export default function BuscadorPage() {
  // 1. Estados para la búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  
  const [filtros, setFiltros] = useState({
    facultad: '',
    anio: '',
    linea: ''
  });

  // Base de datos simulada para el buscador
  const baseDatosDocumentos = [
    { id: 1, titulo: "Optimización de algoritmos en redes neuronales", facultad: "Ingeniería", anio: "2026", linea: "Inteligencia Artificial", score: 98, resumen: "Este proyecto analiza la optimización de algoritmos avanzados para el entrenamiento rápido de redes neuronales orientadas al procesamiento de imágenes." },
    { id: 2, titulo: "Desarrollo de interfaces web con React y Tailwind", facultad: "Ingeniería", anio: "2025", linea: "Desarrollo de Software", score: 85, resumen: "Estudio sobre el impacto del desarrollo de interfaces modernas usando React, analizando componentes reactivos y estilos eficientes." },
    { id: 3, titulo: "Análisis de Big Data en el sector salud", facultad: "Salud", anio: "2026", linea: "Ciencia de Datos", score: 92, resumen: "Implementación de modelos de procesamiento distribuido para el análisis masivo de datos clínicos y predicción de patologías." },
    { id: 4, titulo: "Metodologías ágiles en equipos remotos de software", facultad: "Ingeniería", anio: "2024", linea: "Gestión de Proyectos", score: 74, resumen: "Evaluación de metodologías como Scrum en entornos de desarrollo de software con equipos completamente distribuidos." }
  ];

  const [resultados, setResultados] = useState(baseDatosDocumentos);

  // 2. Lógica para la Barra de Búsqueda con Sugerencias
  useEffect(() => {
    if (busqueda.trim() === '') {
      setSugerencias([]);
      return;
    }
    // Filtra títulos que coincidan con lo que escribe el usuario para las sugerencias
    const sugeridos = baseDatosDocumentos
      .filter(doc => doc.titulo.toLowerCase().includes(busqueda.toLowerCase()))
      .map(doc => doc.titulo);
    setSugerencias(sugeridos);
  }, [busqueda]);

  // 3. Criterio de Aceptación: Filtros interactivos sin recargar la página
  useEffect(() => {
    let filtrados = baseDatosDocumentos;

    if (busqueda) {
      filtrados = filtrados.filter(doc => 
        doc.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
        doc.resumen.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    if (filtros.facultad) {
      filtrados = filtrados.filter(doc => doc.facultad === filtros.facultad);
    }
    if (filtros.anio) {
      filtrados = filtrados.filter(doc => doc.anio === filtros.anio);
    }
    if (filtros.linea) {
      filtrados = filtrados.filter(doc => doc.linea === filtros.linea);
    }

    setResultados(filtrados);
  }, [busqueda, filtros]); // Al cambiar búsqueda o filtros, React actualiza la UI al instante

  // 4. Función para resaltar el texto coincidente (<mark>)
  const resaltarTexto = (texto, palabraClave) => {
    if (!palabraClave.trim()) return texto;
    const partes = texto.split(new RegExp(`(${palabraClave})`, 'gi'));
    return partes.map((parte, i) => 
      parte.toLowerCase() === palabraClave.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{parte}</mark> 
        : parte
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col md:flex-row gap-6">
      
      {/* PANEL LATERAL DE FILTROS */}
      <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow h-fit">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Filtrar por:</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Facultad</label>
            <select 
              value={filtros.facultad}
              onChange={(e) => setFiltros({...filtros, facultad: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="">Todas</option>
              <option value="Ingeniería">Ingeniería</option>
              <option value="Salud">Salud</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Año</label>
            <select 
              value={filtros.anio}
              onChange={(e) => setFiltros({...filtros, anio: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="">Todos</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Línea de Investigación</label>
            <select 
              value={filtros.linea}
              onChange={(e) => setFiltros({...filtros, linea: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="">Todas</option>
              <option value="Inteligencia Artificial">Inteligencia Artificial</option>
              <option value="Desarrollo de Software">Desarrollo de Software</option>
              <option value="Ciencia de Datos">Ciencia de Datos</option>
            </select>
          </div>

          <button 
            onClick={() => setFiltros({ facultad: '', anio: '', linea: '' })}
            className="w-full mt-2 text-xs text-red-600 hover:underline text-left"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* SECCIÓN PRINCIPAL DE BÚSQUEDA Y RESULTADOS */}
      <div className="w-full md:w-3/4 flex flex-col gap-4">
        
        {/* BARRA DE BÚSQUEDA CON SUGERENCIAS */}
        <div className="relative">
          <input 
            type="text"
            placeholder="Buscar proyectos o artículos semánticos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onFocus={() => setMostrarSugerencias(true)}
            onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
            className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Desplegable de Sugerencias */}
          {mostrarSugerencias && sugerencias.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {sugerencias.map((sug, index) => (
                <li 
                  key={index}
                  onClick={() => setBusqueda(sug)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                >
                  {sug}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* LISTADO DE RESULTADOS */}
        <div className="space-y-4">
          <h3 className="text-gray-600 text-sm font-medium">Resultados encontrados: ({resultados.length})</h3>
          
          {resultados.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition border border-gray-100">
              <div className="flex justify-between items-start gap-4 mb-2">
                <h4 className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer">
                  {resaltarTexto(doc.titulo, busqueda)}
                </h4>
                {/* Criterio: Chip con % de similitud / Score */}
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {doc.score}% similitud
                </span>
              </div>
              
              {/* Criterio: Fragmentos resaltados en el texto */}
              <p className="text-sm text-gray-600 mb-3">
                {resaltarTexto(doc.resumen, busqueda)}
              </p>

              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">Año: {doc.anio}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Facultad: {doc.facultad}</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Línea: {doc.linea}</span>
              </div>

              {/* Criterio de Aceptación: Sección de Relacionados con mínimo 3 sugerencias */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Artículos Relacionados:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200 hover:bg-gray-100 cursor-pointer truncate">🔗 Análisis predictivo avanzado</div>
                  <div className="p-2 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200 hover:bg-gray-100 cursor-pointer truncate">🔗 Modelos de lenguaje en UI</div>
                  <div className="p-2 bg-gray-50 rounded text-xs text-gray-700 border border-gray-200 hover:bg-gray-100 cursor-pointer truncate">🔗 Herramientas ágiles 2026</div>
                </div>
              </div>

            </div>
          ))}

          {resultados.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border shadow text-gray-500">
              No se encontraron resultados que coincidan con los filtros o la búsqueda.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}