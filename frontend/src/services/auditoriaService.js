import axiosInstance from '../utils/axiosInstance';

export const auditoriaService = {
  listar: (page = 0, size = 30) =>
    axiosInstance.get('/api/auditoria', { params: { page, size } }).then(r => r.data),

  listarPorUsuario: (usuarioId, page = 0, size = 30) =>
    axiosInstance.get(`/api/auditoria/usuario/${usuarioId}`, { params: { page, size } })
      .then(r => r.data),

  listarPorAccion: (accion, page = 0, size = 30) =>
    axiosInstance.get(`/api/auditoria/accion/${accion}`, { params: { page, size } })
      .then(r => r.data),
};
