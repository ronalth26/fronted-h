// src/app/activacion-de-alarma.js

import React from 'react';
import styles from './activacion-de-alarma.module.css';

const ActivacionDeAlarma = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Activación de Alarma</h1>
      <p className={styles.description}>
        Aquí podrás activar o desactivar la alarma de seguridad para Slinky.
      </p>
      {/* Agrega más contenido aquí según sea necesario */}
    </div>
  );
};

export default ActivacionDeAlarma;
