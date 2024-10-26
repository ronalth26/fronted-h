'use client';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN_BACK, DOMAIN_FRONT } from '../../../env';
import Sidebar from '../components/sidebar';
import SidebarEspecialista from '../components/sidebarEspecialista';
import './profile.css';
import useToken from '../utils/auth';
import { useJwt } from "react-jwt";

export default function ProfilePage() {
  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);

  const [idUsuario, setIdUsuario] = useState(0);
  const [especialista, setEspecialista] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (decodedToken) {
      setIdUsuario(decodedToken.data.id);
      setEspecialista(decodedToken.data.especialista);
      setIsLoading(false);
    }
  }, [decodedToken]);

  const [usuario, setUsuario] = useState([]);

  useEffect(() => {
    if (idUsuario !== 0) {
      fetch(`${DOMAIN_BACK}?controller=usuarios&action=traer_usuario&idUsuario=${idUsuario}`)
        .then((response) => response.json())
        .then((data) => {
          setUsuario(data);
        })
        .catch((error) => console.error('Error al traer datos del usuario:', error));
    }
  }, [idUsuario]);

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
        <div>Loading...</div>
      ) : (
        <>
          {especialista === '0' ? (
            <Sidebar />
          ) : (
            <SidebarEspecialista />
          )}
          <section className="profile-section" style={{ marginTop: '10rem', marginBottom: '4rem' }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6 text-center mb-5">
                  <h3>Contacto</h3>
                </div>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">
                  <div className="wrap">
                    <img src="/logo_work.png" width="100%" alt="Logo"></img>
                    <div className="profile-wrap p-4 p-md-5">
                      <form>
                        <h5>Correo Electrónico</h5>
                        <p>soporte@workitout.com</p>
                        <h5>Teléfono</h5>
                        <p>+51 902 747 165</p>
                        <h5>Horario de Atención</h5>
                        <p>Lunes a Viernes, de 9:00am a 18:00 pm </p>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://api.whatsapp.com/send?phone=51902747165&text=%C2%A1Hola!%20%C2%BFEn%20qu%C3%A9%20podemos%20ayudarte%3F"
                        >
                          <button type="button" className="btn btn-primary form-control">
                            Envíanos un mensaje al WhatsApp
                          </button>
                        </a>
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
