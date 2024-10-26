'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './valoracion-cliente.module.css';
import Sidebar from '../components/sidebar';

const ValoracionCliente = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (index) => {
    setRating(index);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === '') {
      toast.error('Por favor, complete todos los campos.');
      return;
    }
    toast.success('¡Calificación enviada con éxito!');
  };

  return (
    <>
      <ToastContainer />
      <Sidebar/>
      <div className={styles.container} style={{marginTop: '4rem', marginBottom: '4rem'}}>
        <h1>¡GRACIAS POR USAR WORKITOUT!</h1>
        <h2>Ahora califica tu experiencia</h2>
        <div className={styles.imageContainer}>
          <Image src="/placeholder-image.png" alt="Nombre del especialista" width={100} height={100} />
          <p>Nombre del especialista</p>
        </div>
        <div className={styles.ratingContainer}>
          <p>¿Cómo fue tu experiencia con el servicio?</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((index) => (
              <span key={index} onClick={() => handleRatingChange(index)} className={index <= rating ? styles.filledStar : styles.emptyStar}>
                ★
              </span>
            ))}
          </div>
        </div>
        <div className={styles.commentContainer}>
          <label htmlFor="comment">Agrega un comentario acerca del servicio</label>
          <textarea id="comment" value={comment} onChange={handleCommentChange} />
        </div>
        <a href='/plataforma'>
        <button className={styles.submitButton} onClick={handleSubmit}>
          Enviar Calificación
        </button>
        </a>
      </div>
    </>
  );
};

export default ValoracionCliente;
