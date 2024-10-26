'use client';
import React, { useState,useEffect} from 'react';
import SidebarEspecialista from '../../components/sidebarEspecialista';
import '../visualizacion-solicitudes-especialista.css';
import { DOMAIN_FRONT, DOMAIN_BACK } from '../../../../env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DetalleSolicitud = ({params}) => {

    
  const id_solicitud = params.id_solicitud;

  const [solicitud, setSolicitud] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    categoria: '',
    estado: '',
    precio: '',
    descripcion: '',
    fechaHora: '',
    numeroSolicitud: '',
    direccion: '',
  });

  // TRAER LAS SOLICITUD
  useEffect(() => {
    // Fetch solicitud details from the backend
    fetch(
      DOMAIN_BACK +
        '?controller=solicitudes&action=traer_solicitud&idSolicitud=' +
        id_solicitud
    )
      .then((response) => response.json())
      .then((data) => {

         console.log(data);
        setSolicitud({
          nombres: data.nombre,
          apellidos: data.apellido,
          telefono: data.telefono,
          idCliente: data.idCliente,
          idSolicitud: data.idSolicitud,
          categoria: data.nombreServicio,
          estado: data.estado,
          precio: data.precio,
          descripcion: data.descripcion,
          fechaHora: data.fechaHoraSolicitud,
          numeroSolicitud: data.idSolicitud,
          direccion: data.ubicacion,
        });
      })
      .catch((error) => console.error('Error al traer solicitud:', error));
  }, []);




  return (
    <>
      <SidebarEspecialista />
      <section className="profile-section"style={{marginTop:'2rem'}}>
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
                      <span className="precio">S/. {solicitud.precio}</span>
                      <span className="metodo-pago">Efectivo</span>
                    </div>
                    <div className="detalle-info">
                      <h6>Cliente</h6>
                      <p>{solicitud.nombres} {solicitud.apellidos}</p>
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
                      <p>#000{solicitud.numeroSolicitud}</p>
                    </div>
                    <div className="detalle-info">
                      <h6>Dirección</h6>
                      <p>{solicitud.direccion}</p>
                    </div>
                      {solicitud.estado == "2" && (
                          <>
                            <a  target="_blank" href={'https://api.whatsapp.com/send?phone='+solicitud.telefono+'&text=%C2%A1Hola!%20Soy%20un%20especialista%20del%20equipo%20Workitout%20%F0%9F%94%A7%F0%9F%A7%91%E2%80%8D%F0%9F%94%A7%0AAcepte%20tu%20solicitud%20de%20servicio%20y%20me%20gustar%C3%ADa%20contactarme%20contigo%20para%20coordinar%20la%20realizaci%C3%B3n%20de%20este.%20%F0%9F%A4%97'}><button className="btn btn-primary form-control">Contactar Cliente</button></a>
                            <a href={'/valoracion-especialista/'+id_solicitud}><button className="btn btn-primary form-control">Finalizar Solicitud</button></a>
                          </>
                      )}
                      {solicitud.estado == "3" && (
                          <a href="#"><button className="btn btn-primary form-control">Solicitud Finalizada</button></a>
                      )}
                     
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