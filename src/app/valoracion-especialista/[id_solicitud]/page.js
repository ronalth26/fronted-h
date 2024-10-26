'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from 'react-icons/fa';
import styles from '../valoracion-especialista.module.css';
import SidebarEspecialista from '../../components/sidebarEspecialista';
import { DOMAIN_FRONT, DOMAIN_BACK } from '../../../../env';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function ValoracionEspecialista({params}) {
    
    
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


  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  // const handleSubmit = () => {
  //   toast.success("¡Gracias por tu valoración!", {
  //     position: "top-right"
  //   });

  //   console.log(rating);
  //   console.log(comment);
  //   console.log(id_solicitud);
  //   // Backend
  //   // fetch('/api/valoracion', {
  //   //   method: 'POST',
  //   //   body: JSON.stringify({ rating, comment }),
  //   // });
  // };


  const handleSubmit = async () => {
    try {
      const response = await fetch(`${DOMAIN_BACK}?controller=valoraciones&action=actualizar_valoracion_cliente`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idSolicitud: id_solicitud,
          puntuacionCliente: parseInt(rating),
          comentarioCliente: comment
        })
      });
      const data = await response.json();
      if (data.estado === 1) {
        toast.success(data.mensaje);
        setTimeout(() => {
          window.location = DOMAIN_FRONT+"visualizacion-solicitudes-especialista"
        }, 2000);
      } else {
        toast.error(data.mensaje);
      }
    } catch (error) {
      console.error('Error al calificar:', error);
      toast.error('Error al calificar');
    }
  };

  return (
    <div className={styles.container} style={{marginTop: '4rem', marginBottom: '4rem'}}>
      <ToastContainer />
      <SidebarEspecialista/>
      <h5 class="mt-4">¡GRACIAS POR USAR WORKITOUT!</h5>
      <h6>Ahora califica tu experiencia con</h6>
      <div className={styles.clientInfo}>
        <div style={{maxWidth:'30%',margin:'0 auto'}}>
          {/* Aquí va la imagen del cliente */}
           <img src="/calificar.png" width={'100%'}/>
        </div>
        <p className='mt-2'>{solicitud.nombres} {solicitud.apellidos}</p>
      </div>
      <div className={styles.rating}>
        <p>¿Cómo fue tu experiencia con el cliente?</p>
      
         <Stack spacing={2} justifyContent="center" alignItems="center">
           <Rating name="size-large"  size="large" precision={1} onChange={(e)=>setRating(e.target.value)} defaultValue={5} />
         </Stack>
      </div>
      <div className={styles.commentSection}>
        <label htmlFor="comment">Agrega un comentario acerca del servicio</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <a href='#'><button className={styles.submitButton} onClick={handleSubmit}>Enviar Calificación</button></a>
    </div>
  );
}
