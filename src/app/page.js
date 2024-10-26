'use client';
import React, { useState,useRef} from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN_BACK, DOMAIN_FRONT } from '../../env';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { signIn, signOut, useSession } from 'next-auth/react';
import GoogleIcon from '@mui/icons-material/Google';
import ReCAPTCHA from 'react-google-recaptcha';


export default function Login() {

  const { data: session } = useSession();

  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  //** @async función para logearse a la plataforma */
  const Logearse = async () => {

    if(captcha.current.getValue()){

    const regexCorreo = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  
    if (regexCorreo.test(correo) && contraseña.length > 0) {
      try {
        const url = `${DOMAIN_BACK}?controller=usuarios&action=login`;
        console.log('Enviando solicitud a:', url);
  
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: correo,
            password: contraseña
          })
        });
  
        const data = await response.json();
        console.log('Datos recibidos:', data);
  
        if (data.estado === 1) {
          toast.success(data.mensaje, {
            position: "top-right"
          });
          
          localStorage.setItem('token_WORK', data.token);

          setTimeout(() => {
            window.location.href = DOMAIN_FRONT + 'plataforma';
          }, 2000);
  
        } else {
          toast.error(data.error, {
            position: "top-right"
          });
        }
      } catch (error) {
        console.error('Error al logearse:', error);
        toast.error('Error al logearse: ' + error.message, {
          position: "top-right"
        });
      }
  
    } else {
      toast.error("Correo o Contraseña Incorrectos!", {
        position: "top-center"
      });
    }

  } else {
        
    toast.error('Por favor Seleccionar el Captcha', {
     position: "top-center",
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     progress: undefined,
     theme: "light",
     });
   }
  }



    const captcha = useRef(null);

      const onChange = async () => {
          if(captcha.current.getValue()){
              console.log('El usuario no es un robot');
          }
      }




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
                        {/* <h3 className="mb-4">WorkItOut</h3> */}
                      </center>
                    </div>
                  </div>
                  <form action="#" className="mt-5">
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} htmlFor="username">Correo Electrónico</label>
                      <input type="mail" className="form-control p-2" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }} className="" htmlFor="password">Contraseña</label>
                      <div className="input-group">
                        <input id="password-field" type={showPassword ? "text" : "password"} className="form-control p-2" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
                        <div className="input-group-append">
                          <button type="button" className="btn btn-outline-secondary" onClick={toggleShowPassword}>
                            {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                        <div className="recapcha">
                         <ReCAPTCHA ref={captcha} sitekey="6Le47ggqAAAAANQz7CN1LEcvgAR2xlaENDtLnnj0" onChange={onChange}/>
                        </div>
                     </div>
                    <div className="form-group mt-3">
                      <button type="button" className="form-control btn btn-primary rounded submit px-3" onClick={Logearse}>INGRESAR</button>
                    </div>
                  
                    {/* <div className="form-group d-md-flex">
                      <div className="w-50 text-md-left">
                        <a href="#" style={{ color: '#01d28e' }}>Te olvidaste la contraseña?</a>
                      </div>
                    </div> */}
                  </form>
                  <p className="text-center">Aún no te registras? <a data-toggle="tab" href={DOMAIN_FRONT+'registro'}>REGISTRARSE</a></p>
                 
                     <div className="form-group">
                 
                       {!session ? (
                         <>
                          <center>
                             <button className='btn btn-danger p-2' onClick={() => signIn('google')}> <GoogleIcon/> Iniciar sesión con Google </button>
                           </center>
                         </>
                       ) : (
                         <>
                           <p>Bienvenido, {session.user.name}</p>
                           <button onClick={() => signOut()}>Cerrar sesión</button>
                         </>
                       )}
                  
                   </div>
                  
                
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}