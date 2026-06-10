import axiosInstance from '../utils/axiosInstance';

export const buscarSemantico = async (consulta, limite = 10) => {
  const { data } = await axiosInstance.post('/api/busqueda/semantica', { consulta, limite });
  return data;
};
