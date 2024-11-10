// Agrega "use client" al principio del archivo para indicar que es un Client Component
'use client';

import React, { useState } from 'react';

function NuevaPublicacion() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const alternarModal = () => setMostrarModal(!mostrarModal);

  return (
    <div>
      <a href="#" onClick={alternarModal}>
        <button className="btn btn-primary ms-2">
          <i className="fas fa-map-marker-alt"></i> Nueva Publicación
        </button>
      </a>

      {mostrarModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Nueva Publicación</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={alternarModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input type="text" className="form-control" id="titulo" placeholder="Ingrese el título" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea className="form-control" id="descripcion" rows="3" placeholder="Ingrese la descripción"></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={alternarModal}>Cerrar</button>
                <button type="button" className="btn btn-primary">Publicar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NuevaPublicacion;
