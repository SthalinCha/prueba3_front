import React, { useEffect, useState } from 'react';
import { obtenerClientes, crearCliente, actualizarCliente, eliminarCliente } from '../api/ClienteApi';
import '../index.css';

const ClientesView = () => {
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [formData, setFormData] = useState({ nombre: '', sueldo: '', antiguedad: '', bono: '' });
  const [editandoId, setEditandoId] = useState(null);

  // Obtener todos los clientes al cargar el componente
  useEffect(() => {
    obtenerClientes()
      .then((res) => setClientes(res.data))
      .catch((error) => setMensaje(`Error al cargar los clientes: ${error.message}`));
  }, []);

  // Calcular el bono basado en sueldo y antigüedad
  const calcularBono = (sueldo, antiguedad) => {
    let bonoAntiguedad = 0;
    if (antiguedad > 2 && antiguedad < 5) {
      bonoAntiguedad = sueldo * 0.2;
    } else if (antiguedad >= 5) {
      bonoAntiguedad = sueldo * 0.3;
    }

    let bonoSueldo = 0;
    if (sueldo < 1000) {
      bonoSueldo = sueldo * 0.25;
    } else if (sueldo <= 3500) {
      bonoSueldo = sueldo * 0.15;
    } else {
      bonoSueldo = sueldo * 0.10;
    }

    return Math.max(bonoAntiguedad, bonoSueldo);
  };

  // Manejar el cambio en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    if (name === 'sueldo' || name === 'antiguedad') {
      newFormData.bono = calcularBono(newFormData.sueldo, newFormData.antiguedad);
    }

    setFormData(newFormData);
  };

  // Manejar la creación de un nuevo cliente
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

  // Manejar la actualización de un cliente
  const manejarActualizar = (e) => {
    e.preventDefault();
    actualizarCliente(editandoId, formData)
      .then((res) => {
        setClientes(
          clientes.map((cliente) => (cliente._id === editandoId ? res.data : cliente))
        );
        setMensaje('Cliente actualizado con éxito');
        setFormData({ nombre: '', sueldo: '', antiguedad: '', bono: '' });
        setEditandoId(null);
      })
      .catch((error) => setMensaje(`Error al actualizar el cliente: ${error.response?.data?.error || error.message}`));
  };

  // Manejar la eliminación de un cliente
  const manejarEliminar = (id) => {
    eliminarCliente(id)
      .then(() => {
        setClientes(clientes.filter((cliente) => cliente._id !== id));
        setMensaje('Cliente eliminado con éxito');
      })
      .catch((error) => setMensaje(`Error al eliminar el cliente: ${error.response?.data?.error || error.message}`));
  };

  return (
    <div>
      <h1 id="titulo-gestion-clientes">Gestión de Clientes</h1>

      {mensaje && <p id="mensaje">{mensaje}</p>}

      <form id="formulario-cliente" onSubmit={editandoId ? manejarActualizar : manejarCrear}>
        <input
          id="nombre-cliente"
          type="text"
          name="nombre"
          placeholder="Nombre del cliente"
          value={formData.nombre}
          onChange={manejarCambio}
        />
        <input
          id="sueldo-cliente"
          type="number"
          name="sueldo"
          placeholder="Sueldo del cliente"
          value={formData.sueldo}
          onChange={manejarCambio}
        />
        <input
          id="antiguedad-cliente"
          type="number"
          name="antiguedad"
          placeholder="Antigüedad del cliente (en años)"
          value={formData.antiguedad}
          onChange={manejarCambio}
        />
        <input
          id="bono-cliente"
          type="number"
          name="bono"
          placeholder="Bono calculado"
          value={formData.bono}
          disabled
        />
        <button id="submit-cliente" type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <ul id="lista-clientes">
        {clientes.map((cliente) => (
          <li key={cliente._id} id={`cliente-${cliente._id}`}>
            {cliente.nombre} - Sueldo: {cliente.sueldo} - Antigüedad: {cliente.antiguedad} años - Bono: {cliente.bono}
            <button
              id={`editar-cliente-${cliente._id}`}
              onClick={() => {
                setEditandoId(cliente._id);
                setFormData({
                  nombre: cliente.nombre,
                  sueldo: cliente.sueldo,
                  antiguedad: cliente.antiguedad,
                  bono: cliente.bono
                });
              }}
            >
              Editar
            </button>
            <button
              id={`eliminar-cliente-${cliente._id}`}
              onClick={() => manejarEliminar(cliente._id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesView;
