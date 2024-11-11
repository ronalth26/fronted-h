import React, { useState } from 'react';

const ModalPublicacion = ({ mostrar, toggleModal }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handlePublish = () => {
    if (titulo && descripcion) {
      // Aquí puedes manejar la lógica para enviar los datos, como hacer una petición a una API
      console.log("Publicación realizada", { titulo, descripcion });
      toggleModal(); // Cerrar el modal después de publicar
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  if (!mostrar) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Nueva Publicación</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleModal}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="titulo">Título</label>
                <input
                  type="text"
                  className="form-control"
                  id="titulo"
                  placeholder="Ingrese el título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  className="form-control"
                  id="descripcion"
                  rows="3"
                  placeholder="Ingrese la descripción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={toggleModal}>Cerrar</button>
            <button type="button" className="btn btn-primary" onClick={handlePublish}>Publicar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPublicacion;
