'use client';
import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import './DetalleSolicitudEditable.css';

const DetalleSolicitudEditable = () => {
  const [solicitud, setSolicitud] = useState({
    categoria: 'Lavanderia',
    estado: 'Buscando a un prestador de servicios',
    precio: 'PEN50',
    descripcion: 'Quiero que laven las frazadas de mi casa, son 5 en total',
    fechaHora: '2023-06-17T13:00',
    numeroSolicitud: '014D452F',
    direccion: 'Av. 12 de Octubre 602'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSolicitud({ ...solicitud, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para guardar los cambios
    console.log('Cambios guardados:', solicitud);
  };

  return (
    <>
      <Sidebar />
      <section className="profile-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="wrap">
                <div className="profile-wrap p-4 p-md-5">
                  <div className="col-md-12 text-center mb-5">
                    <h3 className="form-title">Detalles de la solicitud</h3>
                  </div>
                  <form onSubmit={handleSubmit} className="detalle-solicitud">
                    <div className="estado-solicitud">
                      <div className="estado-header">
                        <h5>{solicitud.categoria}</h5>
                        <span className="estado-badge">{solicitud.estado}</span>
                      </div>
                      <button type="button" className="estado-button">Pasos a seguir</button>
                    </div>
                    <div className="detalle-precio">
                      <input
                        type="text"
                        name="precio"
                        className="form-control p-2"
                        value={solicitud.precio}
                        onChange={handleChange}
                      />
                      <span className="metodo-pago">Efectivo</span>
                    </div>
                    <div className="detalle-info">
                      <h6>Descripción</h6>
                      <textarea
                        name="descripcion"
                        className="form-control p-2"
                        value={solicitud.descripcion}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="detalle-info">
                      <h6>Fecha y hora</h6>
                      <input
                        type="datetime-local"
                        name="fechaHora"
                        className="form-control p-2"
                        value={solicitud.fechaHora}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="detalle-info">
                      <h6>Número de solicitud</h6>
                      <p>{solicitud.numeroSolicitud}</p>
                    </div>
                    <div className="detalle-info">
                      <h6>Dirección</h6>
                      <input
                        type="text"
                        name="direccion"
                        className="form-control p-2"
                        value={solicitud.direccion}
                        onChange={handleChange}
                      />
                    </div>
                    <a href='/visualizacion-solicitud-proceso-cliente'>
                    <button type="submit" className="form-control btn btn-primary rounded submit px-3">
                      Guardar cambios
                    </button>
                    </a>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetalleSolicitudEditable;
