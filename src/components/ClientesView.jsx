import React, { useEffect, useState } from 'react';
import { obtenerClientes, crearCliente, actualizarCliente, eliminarCliente } from '../api/ClienteApi';
import '../index.css';

const ClientesView = () => {
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [formData, setFormData] = useState({ nombre: '', sueldo: '', antiguedad: '', bono: '' });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerClientes()
      .then((res) => setClientes(res.data))
      .catch((error) => setMensaje(`Error al cargar los clientes: ${error.message}`));
  }, []);

  const calcularBono = (sueldo, antiguedad) => {
    let bonoAntiguedad = antiguedad > 2 && antiguedad < 5 ? sueldo * 0.2 : antiguedad >= 5 ? sueldo * 0.3 : 0;
    let bonoSueldo = sueldo < 1000 ? sueldo * 0.25 : sueldo <= 3500 ? sueldo * 0.15 : sueldo * 0.10;
    return Math.max(bonoAntiguedad, bonoSueldo);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    if (name === 'sueldo' || name === 'antiguedad') {
      newFormData.bono = calcularBono(newFormData.sueldo, newFormData.antiguedad);
    }
    setFormData(newFormData);
  };

  const manejarCrear = (e) => {
    e.preventDefault();
    crearCliente(formData)
      .then((res) => {
        setClientes([...clientes, res.data]);
        setMensaje('Cliente creado con éxito');
        setFormData({ nombre: '', sueldo: '', antiguedad: '', bono: '' });
      })
      .catch((error) => setMensaje(`Error al crear el cliente: ${error.response?.data?.error || error.message}`));
  };

  const manejarActualizar = (e) => {
    e.preventDefault();
    actualizarCliente(editandoId, formData)
      .then((res) => {
        setClientes(clientes.map((cliente) => (cliente._id === editandoId ? res.data : cliente)));
        setMensaje('Cliente actualizado con éxito');
        setFormData({ nombre: '', sueldo: '', antiguedad: '', bono: '' });
        setEditandoId(null);
      })
      .catch((error) => setMensaje(`Error al actualizar el cliente: ${error.response?.data?.error || error.message}`));
  };

  const manejarEliminar = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este cliente?')) {
      eliminarCliente(id)
        .then(() => {
          setClientes(clientes.filter((cliente) => cliente._id !== id));
          setMensaje('Cliente eliminado con éxito');
        })
        .catch((error) => setMensaje(`Error al eliminar el cliente: ${error.response?.data?.error || error.message}`));
    }
  };

  return (
    <div className="clientes-container">
      <h1>Gestión de Clientes</h1>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      
      <form onSubmit={editandoId ? manejarActualizar : manejarCrear} className="formulario-cliente">
        <input type="text" name="nombre" placeholder="Nombre del cliente" value={formData.nombre} onChange={manejarCambio} />
        <input type="number" name="sueldo" placeholder="Sueldo del cliente" value={formData.sueldo} onChange={manejarCambio} />
        <input type="number" name="antiguedad" placeholder="Antigüedad del cliente (en años)" value={formData.antiguedad} onChange={manejarCambio} />
        <input type="number" name="bono" placeholder="Bono calculado" value={formData.bono} disabled />
        <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <ul className="lista-clientes">
        {clientes.map((cliente) => (
          <li key={cliente._id}>
            {cliente.nombre} - Sueldo: {cliente.sueldo} - Antigüedad: {cliente.antiguedad} años - Bono: {cliente.bono}
            <button onClick={() => {
              setEditandoId(cliente._id);
              setFormData({ nombre: cliente.nombre, sueldo: cliente.sueldo, antiguedad: cliente.antiguedad, bono: cliente.bono });
            }}>Editar</button>
            <button onClick={() => manejarEliminar(cliente._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesView;
