import axiosInstance from '../utils/axiosInstance';

const descargar = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportService = {
  exportarCsv: async () => {
    const res = await axiosInstance.get('/api/export/csv', { responseType: 'blob' });
    descargar(res.data, `trabajos_grado_${new Date().toISOString().slice(0,10)}.csv`);
  },
  exportarJson: async () => {
    const res = await axiosInstance.get('/api/export/json', { responseType: 'blob' });
    descargar(res.data, `trabajos_grado_${new Date().toISOString().slice(0,10)}.json`);
  },
};
