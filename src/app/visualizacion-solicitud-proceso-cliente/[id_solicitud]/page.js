'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import '../DetalleSolicitud.css';
import { DOMAIN_FRONT, DOMAIN_BACK } from '../../../../env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

const DetalleSolicitud = ({ params }) => {
  const id_solicitud = params.id_solicitud;

  const [solicitud, setSolicitud] = useState({
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
        setSolicitud({
          idSolicitud: data.idSolicitud,
          categoria: data.nombreServicio,
          estado: data.estado,
          precio: data.precio,
          descripcion: data.descripcion,
          fechaHora: data.fechaHoraSolicitud,
          numeroSolicitud: data.idSolicitud,
          direccion: data.ubicacion,
          calificadaCliente: data.calificadaCliente,
        });
      })
      .catch((error) => console.error('Error al traer solicitud:', error));
  }, []);

  const [negociaciones, setNegociaciones] = useState([]);

  useEffect(() => {
    // Fetch negociaciones from the backend
    fetch(
      DOMAIN_BACK +
        '?controller=solicitudes&action=negociaciones&negociaciones=' +
        id_solicitud
    )
      .then((response) => response.json())
      .then((data) => {
        setNegociaciones(data);
        if (data.length > 0) {
          handleClickOpen();
        }
      })
      .catch((error) => console.error('Error al traer las negociaciones:', error));
  }, []);





  console.log(negociaciones);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (negociacion) => {
    try {
      const response = await fetch(`${DOMAIN_BACK}?controller=solicitudes&action=aceptar_solicitud`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idSolicitud: negociacion.idSolicitud,
          idEspecialista: negociacion.idEspecialista,
          precio: parseFloat(negociacion.precio)
        })
      });
      const data = await response.json();
      if (data.estado === 1) {
        toast.success(data.mensaje);
        setTimeout(() => {
          handleClose();
          window.location.reload();
        }, 2000);
      } else {
        toast.error(data.mensaje);
      }
    } catch (error) {
      console.error('Error al negociar:', error);
      toast.error('Error al negociar');
    }
  };


  // console.log(solicitud);

  return (
    <>
      <Sidebar />
      <ToastContainer />
      <section className="profile-section" style={{ marginTop: '2rem' }}>
        <div className="container" style={{ marginTop: '1rem', marginBottom: '4rem' }}>
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
                        <span className="estado-badge">{solicitud.estado}</span>
                      </div>
                      <button className="estado-button">Pasos a seguir</button>
                    </div>
                    <div className="detalle-precio">
                      <span className="precio">S/. {solicitud.precio}</span>
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
                      <p>#000{solicitud.numeroSolicitud}</p>
                    </div>
                    <div className="detalle-info">
                      <h6>Dirección</h6>
                      <p>{solicitud.direccion}</p>
                    </div>
                    {solicitud.estado == 1 ? (
                      <a href={'/modificar-solicitud-cliente/' + solicitud.idSolicitud}>
                        <button className="btn btn-primary form-control">Cambiar la solicitud</button>
                      </a>
                    ) : (
                        null
                    )}

                    {solicitud.estado == 2 && (
                       <>
                         <img src="/trabajando.png" width="100%" height=""/>
                         <a href="#">
                          <button className="btn btn-dark form-control">Solicitud en Proceso</button>
                         </a>
                        </>
                    )} 

                      {solicitud.calificadaCliente == 0 && solicitud.estado == 3 && (
                       <a href={'/valoracion-cliente/'+id_solicitud}>
                          <button className="btn btn-primary form-control">Calificar Especialista</button>
                         </a>
                      )} 

                      {solicitud.estado == 3 && (
                       <>
                        <img src="/terminada.png" width="100%" height=""/>
                         <a href="#">
                          <button className="btn btn-primary form-control">Solicitud Terminada</button>
                        </a>
                      </>
                       )} 
                 
                 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Tu oferta ya tiene postulantes, acepta la negociación del especialista que más te interese"}
        </DialogTitle>
        <DialogContent>
          {negociaciones.map((negociacion) => (
            <center key={`${negociacion.idEspecialista}-${negociacion.precio}`}>
              <ul className='p-1' style={{ textDecoration: 'none', listStyle: 'none', border: '02px solid #e1e1e1' }}>
                <li>Especialista: {negociacion.nombre} {negociacion.apellido} <br></br> Calificación:<span style={{padding:'10px',marginTop:'35px'}}> <Rating name="size-medium" readOnly  precision={0.5} defaultValue={negociacion.promedioPuntuacion} /></span></li>
                <li>S/. {negociacion.precio}</li>
                <Button className='btn btn-primary mb-2' onClick={() => handleSubmit(negociacion)}>
                  Aceptar Precio
                </Button>
              </ul>
            </center>
          ))}
        </DialogContent>
        <DialogActions>
          <Button className='btn btn-primary' onClick={handleClose} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetalleSolicitud;
