'use client';
import React, { useState,useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import '../DetalleSolicitudEditable.css';
import { DOMAIN_FRONT,DOMAIN_BACK } from '../../../../env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DetalleSolicitudEditable = ({params}) => {

    const id_solicitud = params.id_solicitud;

  const [solicitud, setSolicitud] = useState({
    categoria: '',
    estado: '',
    precio: '',
    descripcion: '',
    fechaHora: '',
    numeroSolicitud: '',
    direccion: ''
  });



  // TRAER LAS SOLICITUD 

 
  useEffect(() => {
    // Fetch categories from the backend
    fetch(DOMAIN_BACK+'?controller=solicitudes&action=traer_solicitud&idSolicitud='+id_solicitud)
      .then(response => response.json())
      .then(data => {
        setSolicitud({
            idSolicitud: data.idSolicitud,
            categoria: data.nombreServicio,
            estado: data.estado,
            precio: data.precio,
            descripcion: data.descripcion,
            fechaHora: data.fechaHoraSolicitud,
            numeroSolicitud:data.idSolicitud,
            direccion: data.ubicacion
          });
      })
      .catch(error => console.error('Error al traer solicitud:', error));

  }, []);


  console.log(id_solicitud);
  console.log(solicitud);






  const handleChange = (e) => {
    const { name, value } = e.target;
    setSolicitud({ ...solicitud, [name]: value });
  };

  const validateForm = () => {
    if (!solicitud.descripcion || !solicitud.direccion || !solicitud.fechaHora || !solicitud.precio) {
      toast.error('Todos los campos son obligatorios');
      return false;
    }
    if (new Date(solicitud.fechaHora) <= new Date()) {
      toast.error('La fecha y hora deben ser futuras');
      return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(solicitud.precio)) {
      toast.error('El precio debe ser un valor monetario válido');
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(`${DOMAIN_BACK}?controller=solicitudes&action=actualizar_solicitud&idSolicitud=`+id_solicitud, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idSolicitud: solicitud.idSolicitud,
            descripcionServicio: solicitud.descripcion,
            direccion: solicitud.direccion,
            fechaHoraSolicitud: solicitud.fechaHora,
            precio: solicitud.precio,
            estado: 1
          })
        });
        const data = await response.json();
        console.log(data);
        if (data.estado === 1) {
          toast.success(data.mensaje);
          setTimeout(() => {
            window.location.href = DOMAIN_FRONT+'visualizacion-solicitud-proceso-cliente/'+id_solicitud;
          }, 2000);
        } else {
          toast.error(data.mensaje);
        }
      } catch (error) {
        console.error('Error al actualizar la solicitud:', error);
        toast.error('Error al actualizar la solicitud');
      }
    }
  };


  

  return (
    <>
      <Sidebar />
      <ToastContainer />
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
                        type="number"
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
                      <p>#000{solicitud.numeroSolicitud}</p>
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
