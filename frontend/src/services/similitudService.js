import axiosInstance from '../utils/axiosInstance';

export const similitudService = {
  listarPendientes: (page = 0, size = 20) =>
    axiosInstance.get('/api/duplicados', { params: { page, size } }).then(r => r.data),

  detectar: () =>
    axiosInstance.post('/api/duplicados/detectar').then(r => r.data),

  marcarRevisado: (id, requiereAccion = false) =>
    axiosInstance.patch(`/api/duplicados/${id}/revisar`, null, { params: { requiereAccion } })
      .then(r => r.data),
};
