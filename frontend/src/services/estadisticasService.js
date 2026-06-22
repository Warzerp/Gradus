import axiosInstance from '../utils/axiosInstance';

export const estadisticasService = {
  resumen:           () => axiosInstance.get('/api/estadisticas/resumen').then(r => r.data),
  porFacultad:       () => axiosInstance.get('/api/estadisticas/por-facultad').then(r => r.data),
  tendenciaAnual:    () => axiosInstance.get('/api/estadisticas/tendencia-anual').then(r => r.data),
  distribucionEstado:() => axiosInstance.get('/api/estadisticas/distribucion-estado').then(r => r.data),
  refrescar:         () => axiosInstance.post('/api/estadisticas/refrescar').then(r => r.data),
};
