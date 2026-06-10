import axiosInstance from '../utils/axiosInstance';

export const listarAutores = async (page = 0, size = 20) => {
  const { data } = await axiosInstance.get('/api/autores', { params: { page, size } });
  return data;
};

export const crearAutor = async (autor) => {
  const { data } = await axiosInstance.post('/api/autores', autor);
  return data;
};

export const actualizarAutor = async (id, autor) => {
  const { data } = await axiosInstance.patch(`/api/autores/${id}`, autor);
  return data;
};

export const desactivarAutor = async (id) => {
  await axiosInstance.delete(`/api/autores/${id}`);
};
