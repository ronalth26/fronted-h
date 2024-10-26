import React, { useState } from 'react';
import './profile.css';

const ProfileForm = ({ user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [email, setEmail] = useState(user.email);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [editMode, setEditMode] = useState(false);

  const handleSave = () => {
    onSave({ name, surname, email, profilePicture });
    setEditMode(false);
  };

  return (
    <div className="profile-form">
      <h3>Configuración de tu Perfil</h3>
      <form>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div className="form-group">
          <label>Apellido</label>
          <input
            type="text"
            className="form-control"
            value={surname}
            onChange={e => setSurname(e.target.value)}
            disabled={!editMode}
          />
        </div>
        <div className="form-group">
          <label>Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Foto de Perfil</label>
          <input
            type="file"
            className="form-control"
            onChange={e => setProfilePicture(e.target.files[0])}
            disabled={!editMode}
          />
        </div>
        {editMode ? (
          <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={() => setEditMode(true)}>Editar</button>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
