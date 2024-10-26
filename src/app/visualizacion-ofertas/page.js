'use client';
import React, { useState } from 'react';
import SidebarEspecialista from '../components/sidebarEspecialista';
import './DetalleOferta.css';

const DetalleSolicitud = () => {
  const [solicitud] = useState({
    categoria: 'Lavanderia',
    //estado: 'Buscando a un prestador de servicios',
    precio: 'PEN50',
    descripcion: 'Quiero que laven las frazadas de mi casa, son 5 en total',
    fechaHora: 'lun 17 junio, 13:00',
    numeroSolicitud: '01',
    direccion: 'Av. 12 de Octubre 602'
  });

  return (
    <>
      <SidebarEspecialista/>
      <section className="profile-section"style={{marginTop:'4rem'}}>
        <div className="container" style={{marginTop:'1rem', marginBottom:'4rem'}}>
        <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="wrap">
                <div className="profile-wrap p-4 p-md-5">
                  <div className="col-md-12 text-center mb-5">
                    <h3 className="form-title">Detalles de la solicitud</h3>
                  </div>
                  <div className="detalle-solicitud">
                    <div className="estado-solicitud">
                      <div className="estado-header">
                        <h5>{solicitud.categoria}</h5>
                        {/* <span className="estado-badge">{solicitud.estado}</span> */}
                      </div>
                      {/* <button className="estado-button">Pasos a seguir</button> */}
                    </div>
                    <div className="detalle-precio">
                      <span className="precio">{solicitud.precio}</span>
                      <span className="metodo-pago">Efectivo</span>
                    </div>
                    <div className="detalle-info">
                      <h6>Descripción</h6>
                      <p>{solicitud.descripcion}</p>
                    </div>
                    <div className="detalle-info">
                      <h6>Fecha y hora</h6>
                      <p>{solicitud.fechaHora}</p>
                    </div>
                    <div className="detalle-info">
                      <h6>Número de solicitud</h6>
                      <p>{solicitud.numeroSolicitud}</p>
                    </div>
                    <div className="detalle-info">
                      <h6>Dirección</h6>
                      <p>{solicitud.direccion}</p>
                    </div>
                    <a href='/visualizacion-solicitud-proceso-especialista'><button className="btn btn-primary form-control">Aceptar Precio</button></a>
                    <a href='#'><button className="btn btn-primary form-control">Negociar Precio</button></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetalleSolicitud;