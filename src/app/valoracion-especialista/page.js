'use client';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from 'react-icons/fa';
import styles from './valoracion-especialista.module.css';
import SidebarEspecialista from '../components/sidebarEspecialista';

export default function ValoracionEspecialista() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    toast.success("¡Gracias por tu valoración!", {
      position: "top-right"
    });
    // Backend
    // fetch('/api/valoracion', {
    //   method: 'POST',
    //   body: JSON.stringify({ rating, comment }),
    // });
  };

  return (
    <div className={styles.container} style={{marginTop: '4rem', marginBottom: '4rem'}}>
      <ToastContainer />
      <SidebarEspecialista/>
      <h1>¡GRACIAS POR USAR WORKITOUT!</h1>
      <h2>Ahora califica tu experiencia</h2>
      <div className={styles.clientInfo}>
        <div className={styles.clientImage}>
          {/* Aquí va la imagen del cliente */}
        </div>
        <p>Nombre del cliente</p>
      </div>
      <div className={styles.rating}>
        <p>¿Cómo fue tu experiencia con el cliente?</p>
        <div className={styles.stars}>
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  className={styles.star}
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={50}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(rating)}
                />
              </label>
            );
          })}
        </div>
      </div>
      <div className={styles.commentSection}>
        <label htmlFor="comment">Agrega un comentario acerca del servicio</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <a href='/plataforma-especialista'><button className={styles.submitButton} onClick={handleSubmit}>Enviar Calificación</button></a>
    </div>
  );
}
