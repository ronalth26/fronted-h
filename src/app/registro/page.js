'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN_BACK, DOMAIN_FRONT } from '../../../env';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [distrito, setDistrito] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [contraseña2, setContraseña2] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /** @async function for user registration */
  const Registrarse = async () => {
    // Validate if both passwords match
    if (password === contraseña2) {
      const regexCorreo = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
      const regex_nombres = /^[a-zA-Z\s]{2,}$/;
      const regex_telefono = /^\d{9}$/;
      const regex_direccion = /^[a-zA-Z0-9\s,'-.#]+$/;
  
      if (
        regex_nombres.test(nombre) &&
        regex_nombres.test(apellido) &&
        regex_telefono.test(telefono) &&
        regex_nombres.test(ciudad) &&
        regex_nombres.test(distrito) &&
        regex_direccion.test(direccion) &&
        regexCorreo.test(correo) &&
        password.length > 0
      ) {
        const payload = {
          nombre: nombre,
          apellido: apellido,
          telefono: telefono,
          email: correo,
          contrasena: password,
          direccion: direccion,
          distrito: distrito,
          provincia: ciudad
        };
  
        try {
          const response = await fetch(`${DOMAIN_BACK}?controller=usuarios&action=registro`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
  
          const data = await response.json();
          console.log(data);
  
          if (data.estado === 1) {
            toast.success(data.mensaje, {
              position: "top-right"
            });
  
            setTimeout(() => {
              window.location.href = DOMAIN_FRONT;
            }, 2000);
          } else {
            toast.error(data.mensaje, {
              position: "top-right"
            });
          }
        } catch (error) {
          console.error('No se registró el usuario:', error);
          toast.error('No se registró el usuario:', {
            position: "top-right"
          });
        }
      } else {
        toast.error("Ingrese los datos correctamente!", {
          position: "top-center"
        });
      }
    } else {
      toast.error("Ambas contraseñas deben ser iguales!", {
        position: "top-center"
      });
    }
  };
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <ToastContainer />
      <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5"></div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="wrap">
                <div className="img">
                  <img src="/logo_work.png" alt="logo" width={'100%'} height={'90%'}/>
                </div>
                <div className="login-wrap p-4 p-md-5">
                  <div className="">
                    <div className="text-center">
                      <center>
                        <h3 className="mb-4">Regístrate en WorkItOut</h3>
                      </center>
                    </div>
                  </div>
                  <form className="">
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} htmlFor="nombre">Ingresa tus nombres</label>
                      <input type="text" className="form-control p-2" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} htmlFor="apellido">Ingresa tus apellidos</label>
                      <input type="text" className="form-control p-2" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} htmlFor="telefono">Ingresa tu teléfono</label>
                      <input type="tel" className="form-control p-2" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} htmlFor="ciudad">Ingresa tu ciudad</label>
                      <input type="text" className="form-control p-2" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} htmlFor="distrito">Ingresa tu distrito</label>
                      <input type="text" className="form-control p-2" value={distrito} onChange={(e) => setDistrito(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} htmlFor="direccion">Ingresa tu dirección</label>
                      <input type="text" className="form-control p-2" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} htmlFor="correo">Correo Electrónico</label>
                      <input type="email" className="form-control p-2" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} className="" htmlFor="contraseña">Contraseña</label>
                      <div className="input-group">
                        <input id="contraseña" type={showPassword ? "text" : "password"} className="form-control p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <div className="input-group-append">
                          <button type="button" className="btn btn-outline-secondary" onClick={toggleShowPassword}>
                            {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} className="" htmlFor="contraseña2">Repetir Contraseña</label>
                      <div className="input-group">
                        <input id="contraseña2" type={showPassword ? "text" : "password"} className="form-control p-2" value={contraseña2} onChange={(e) => setContraseña2(e.target.value)} required />
                        <div className="input-group-append">
                          <button type="button" className="btn btn-outline-secondary" onClick={toggleShowPassword}>
                            {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="button" className="form-control btn btn-primary rounded submit px-3" onClick={Registrarse}>REGISTRARSE</button>
                    </div>
                    <div className="form-group d-md-flex">
                      <div className="w-50 text-md-left">
                        {/* <a href="#" style={{ color: '#01d28e' }}>Te olvidaste la contraseña?</a> */}
                      </div>
                    </div>
                  </form>
                  <p className="text-center">¿Ya tienes una cuenta? <a href={DOMAIN_FRONT}>INGRESAR</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
