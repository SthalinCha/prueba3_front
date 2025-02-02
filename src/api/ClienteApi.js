import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api/clientes',
  });

// Funciones para interactuar con el backend de clientes
export const obtenerClientes = () => api.get('/');
export const obtenerClientePorId = (id) => api.get(`/${id}`);
export const crearCliente = (data) => api.post('/', data);
export const actualizarCliente = (id, data) => api.put(`/${id}`, data);
export const eliminarCliente = (id) => api.delete(`/${id}`);
