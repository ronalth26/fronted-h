'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN_BACK, DOMAIN_FRONT } from '../../../env';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Sidebar from '../components/sidebar';
import SidebarEpecialista from '../components/sidebarEspecialista';
import './profile.css';
import useToken from '../utils/auth';
import { useJwt } from "react-jwt";

export default function ProfilePage() {
  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);

  // useEffect(() => {
  //   if (isExpired || !decodedToken) {
  //     window.location.href = `${DOMAIN_FRONT}/login`;
  //   }
  // }, [isExpired, decodedToken]);

  const [user, setUser] = useState({
    name: 'Nombre Usuario',
    surname: 'Apellido Usuario',
    email: 'usuario@correo.com',
    profilePicture: '/profile.png',
    rating: 4.8,
  });

  const [id_usuario, setIdUsuario] = useState(0);
  const [especialista, setEspecialista] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (decodedToken) {
      setIdUsuario(decodedToken.data.id);
      setEspecialista(decodedToken.data.especialista);
      setIsLoading(false); // Set loading to false after decoding the token
    }
  }, [decodedToken]);

  const [usuario, setUsuario] = useState([]);

  useEffect(() => {
    if (id_usuario !== 0) {
      fetch(
        DOMAIN_BACK +
        '?controller=usuarios&action=traer_usuario&idUsuario=' +
        id_usuario
      )
        .then((response) => response.json())
        .then((data) => {
          setUsuario(data);
        })
        .catch((error) => console.error('Error al traer datos del usuario:', error));
    }
  }, [id_usuario]);

  console.log(usuario);

  const [editMode, setEditMode] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${DOMAIN_BACK}?controller=usuarios&action=actualizar_cliente&idUsuario=${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idUsuario: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono,
          contrasena: usuario.contrasena
        })
      });
      const data = await response.json();
      console.log(data);
      if (data.estado === 1) {
        toast.success(data.mensaje);
        setTimeout(() => {
          window.location.href = DOMAIN_FRONT + 'perfil';
        }, 2000);
      } else {
        toast.error(data.mensaje);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar perfil');
    }
  };

  return (
    <>
      <ToastContainer />
      {isLoading ? (
        <div>Loading...</div> // Display a loading message while the token is being decoded
      ) : (
        <>
          {especialista == '0' ? (
            <Sidebar />
          ) : (
            <SidebarEpecialista />
          )}
          <section className="profile-section" style={{ marginTop: '10rem', marginBottom: '4rem' }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6 text-center mb-5">
                  <h3>Configuración de tu Perfil</h3>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">
                  <div className="wrap">
                    <div className="profile-img" style={{ backgroundImage: `url(${user.profilePicture})` }}></div>
                    <div className="profile-wrap p-4 p-md-5">
                      <form>
                        <div className="form-group mt-3">
                          <label style={{ color: '#000' }}>Nombre</label>
                          <input
                            type="text"
                            className="form-control p-2"
                            value={usuario.nombre}
                            onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                            disabled
                          />
                        </div>
                        <div className="form-group mt-3">
                          <label style={{ color: '#000' }}>Apellido</label>
                          <input
                            type="text"
                            className="form-control p-2"
                            value={usuario.apellido}
                            onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
                            disabled
                          />
                        </div>
                        <div className="form-group mt-3">
                          <label style={{ color: '#000' }}>Correo</label>
                          <input type="email" className="form-control p-2" value={usuario.email} disabled />
                        </div>
                        <div className="form-group mt-3">
                          <label style={{ color: '#000' }}>Teléfono</label>
                          <input
                            type="text"
                            className="form-control p-2"
                            value={usuario.telefono}
                            onChange={(e) => setUsuario({ ...usuario, telefono: e.target.value })}
                            disabled={!editMode}
                          />
                        </div>
                        {editMode ? (
                          <button type="button" className="form-control btn btn-primary rounded submit px-3" onClick={handleSave}>Guardar</button>
                        ) : (
                          <button type="button" className="form-control btn btn-secondary rounded submit px-3" onClick={() => setEditMode(true)}>Editar</button>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
