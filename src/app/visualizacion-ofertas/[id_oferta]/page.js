'use client';
import React, { useState,useEffect, useCallback } from 'react';
import SidebarEspecialista from '../../components/sidebarEspecialista';
import '../DetalleOferta.css';
import { DOMAIN_BACK } from '../../../../env';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


import NotificationButton from '../../components/NotificationButton';

const DetalleSolicitud = ({params}) => {



    const id_solicitud = params.id_oferta;

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
  
    const id_usuario = localStorage.getItem('id_usuarioWORK');


    useEffect(() => {
      // Fetch categories from the backend
      fetch(DOMAIN_BACK+'?controller=solicitudes&action=traer_solicitud&idSolicitud='+id_solicitud)
        .then(response => response.json())
        .then(data => {
          setSolicitud({
              idSolicitud: data.idSolicitud,
              id_cliente: data.id_cliente,
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
  
    console.log(solicitud);
  
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

   const [precio, setPrecio] = useState(0)

    
  const handleSubmit = async (e) => {
    e.preventDefault();

  
     if(precio != 0){


        // handleNegotiation();

        // self.addEventListener('push', function(event) {
        //     // const data = event.data.json();
        //     const options = {
        //       body: 'especialista a enviado nueva presupeusto',
        //       icon: 'icon.png'
        //     };
        //     event.waitUntil(
        //       self.registration.showNotification('Cambia de presupeusto', options)
        //     );
        //   });
          

      try {
        const response = await fetch(`${DOMAIN_BACK}?controller=solicitudes&action=negociar_solicitud`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idSolicitud: solicitud.idSolicitud,
            idCliente: solicitud.id_cliente,
            idEspecialista: id_usuario,
            precio: parseFloat(precio)
          })
        });
        const data = await response.json();
        console.log(data);
        if (data.estado === 1) {
          toast.success(data.mensaje);
          setTimeout(() => {
           handleClose()
          }, 2000);

        } else {
          toast.error(data.mensaje);
        }
      } catch (error) {
        console.error('Error al negociar:', error);
        toast.error('Error al negociar');
      }
    }
  };


  
  const AceptarSolicitud = async (e) => {
    e.preventDefault();

     setPrecio(solicitud.precio)
  
     if(precio != 0){

      try {
        const response = await fetch(`${DOMAIN_BACK}?controller=solicitudes&action=negociar_solicitud`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idSolicitud: solicitud.idSolicitud,
            idCliente: solicitud.id_cliente,
            idEspecialista: id_usuario,
            precio: parseFloat(precio)
          })
        });
        const data = await response.json();
        console.log(data);
        if (data.estado === 1) {
          toast.success(data.mensaje);
          setTimeout(() => {
           handleClose()
          }, 2000);

        } else {
          toast.error(data.mensaje);
        }
      } catch (error) {
        console.error('Error al negociar:', error);
        toast.error('Error al negociar');
      }
    }
  };

  

  const handleNegotiation = async () => {
    await fetch('/sendNotification', {
      method: 'POST',
      body: JSON.stringify({ message: JSON.stringify({ title: 'Negociación', body: 'El especialista ha propuesto una nueva negociación de precio.' }) }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  const sendNotification = (id_usuario) => {
      if('Notification' in window && Notification.permission === 'granted'){

        console.log(id_usuario);
        console.log(solicitud.id_cliente);

         if(id_usuario == solicitud.id_cliente){
           new Notification('Hola Sergio',{
               body:'#solicitud #0003 El especialista ha propuesto una nueva negociación de precio.',
               icon: '/logo_work.png'
           })
        }
      }
  };


  const requestNotification = useCallback(() => {
    if('Notification' in window){
        Notification.requestPermission().then(function (permission){
            if (permission === 'granted'){
                   console.log('permiso garantizado');
                   sendNotification(id_usuario);
            }
        })
    }
  },[]);


  useEffect(() => {
      if('Notification' in window){
         requestNotification();
      }
  }, [requestNotification])
  



  return (
    <>
      <ToastContainer />
      {/* <PushNotification /> */}
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
                      <span className="precio">S/. {solicitud.precio}</span>
                      <span className="metodo-pago" style={{marginLeft:'12px'}}>Efectivo</span>
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
                    <a href="#" onClick={AceptarSolicitud}><button className="btn btn-primary form-control">Aceptar Precio</button></a>
                    <a href='#' onClick={handleClickOpen}><button className="btn btn-primary form-control">Negociar Precio</button></a>
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
          {"Es tu oportunidad para proponer un nuevo precio"}
        </DialogTitle>
        <DialogContent>
          <input
            type="number"
            className="form-control p-2"
            value={precio}
            onChange={(e)=>setPrecio(e.target.value)}
            placeholder="Nuevo Precio"
          />
         
        </DialogContent>
        <DialogActions>
          <Button className='btn btn-primary' onClick={handleSubmit} autoFocus>
            Negociar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetalleSolicitud;