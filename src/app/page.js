"use client";
import GoogleIcon from "@mui/icons-material/Google";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DOMAIN_BACK, DOMAIN_FRONT } from "../../env";
import styles from "./page.module.css";

export default function Login() {
  const { data: session } = useSession();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const Logearse = async () => {
    const regexCorreo = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    if (regexCorreo.test(correo) && contraseña.length > 0) {
      try {
        const url = `${DOMAIN_BACK}?controller=usuarios&action=login`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: correo, password: contraseña }),
        });

        const data = await response.json();
        if (data.estado === 1) {
          toast.success(data.mensaje, { position: "top-right" });
          localStorage.setItem("token_WORK", data.token);
          setTimeout(() => {
            window.location.href = DOMAIN_FRONT + "plataforma";
          }, 2000);
        } else {
          toast.error(data.error, { position: "top-right" });
        }
      } catch (error) {
        toast.error("Error al logearse: " + error.message, {
          position: "top-right",
        });
      }
    } else {
      toast.error("Correo o Contraseña Incorrectos!", {
        position: "top-center",
      });
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <ToastContainer />
      <section className={`${styles.container}`}>
        <div className={styles.leftSection}>
          <img
            src="/policia.png"
            alt="policia"
            className={styles.policeImage}
          />
          <img
            src="/alertaxpressazul.png"
            alt="alerta xpress logo"
            className={styles.logoImage}
          />
        </div>
        <div className={styles.loginContainer}>
          <h2 className={styles.heading}>Iniciar Sesion</h2>

          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Correo Electrónico</label>
              <input
                type="email"
                className={styles.input}
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                </button>
              </div>
            </div>
            <button
              type="button"
              className={styles.loginButton}
              onClick={Logearse}
            >
              INGRESAR
            </button>
          </form>
          <p className={styles.registerText}>
            ¿Aún no te registras?{" "}
            <a href={`${DOMAIN_FRONT}registro`} className={styles.registerLink}>
              REGISTRARSE
            </a>
          </p>
          <button
            className={styles.googleButton}
            onClick={() => signIn("google")}
          >
            {" "}
            <GoogleIcon /> Iniciar sesión con Google{" "}
          </button>
        </div>
      </section>
    </>
  );
}
