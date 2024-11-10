// Sidebar.js
"use client";
import BuildIcon from "@mui/icons-material/Build";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PersonIcon from "@mui/icons-material/Person";
import Person4Icon from "@mui/icons-material/Person4";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

import { Popover, Typography } from "@mui/material";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBars,
  FaBriefcase,
  FaEnvelope,
  FaHome,
  FaInfoCircle,
  FaPaw,
  FaQuestionCircle,
  FaTimes
} from "react-icons/fa";
import { useJwt } from "react-jwt";
import { DOMAIN_BACK, DOMAIN_FRONT } from "../../../env";
import "../estilos/globales.css";
import useToken from "../utils/auth";
import "./listaSidebar.css";
import styles from "./sidebar.module.css";

const Sidebar = () => {
  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [alarmReason, setAlarmReason] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopover, setOpenPopover] = useState(false);

  // Simulación de las notificaciones
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        title: "Nueva Alerta",
        message: "Alerta de seguridad en tu área.",
        link: "/notificacion/1",
      },
      {
        id: 2,
        title: "Actualización de Solicitud",
        message: "Tu solicitud ha sido actualizada.",
        link: "/notificacion/2",
      },
      {
        id: 3,
        title: "Nuevo Mensaje",
        message: "Tienes un nuevo mensaje de un cliente.",
        link: "/notificacion/3",
      },
      {
        id: 4,
        title: "Revisión de Documento",
        message: "Tu documento ha sido revisado y aprobado.",
        link: "/notificacion/4",
      },
      {
        id: 5,
        title: "Nuevo Registro",
        message: "Se ha registrado una nueva solicitud de servicio.",
        link: "/notificacion/5",
      },
    ]);
  }, []);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenPopover(false);
  };
  // useEffect(() => {
  //   if (Token == null) {
  //     console.log('Token has expired, redirecting to login page.');
  //     window.location.href = `${DOMAIN_FRONT}`;
  //   }
  // }, [isExpired]);

  useEffect(() => {
    if (Token == null || isExpired) {
      console.log("Token has expired, redirecting to login page.");
      // window.location.href = `${DOMAIN_FRONT}`;
    }
  }, [Token, isExpired]);

  useEffect(() => {
    // console.log('Token expiration status:', isExpired);
  }, [isExpired]);

  const [id_usuario, setIdUsuario] = useState(0);
  const [especialista, setEspecialista] = useState(0);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");

  useEffect(() => {
    if (decodedToken) {
      setIdUsuario(decodedToken.data.id);
      setEspecialista(decodedToken.data.especialista);
      setNombre(decodedToken.data.nombre);
      setApellido(decodedToken.data.apellido);
    }
  }, [decodedToken]);

  const [promedios, setPromedios] = useState([]);

  useEffect(() => {
    if (id_usuario !== 0) {
      fetch(
        `${DOMAIN_BACK}?controller=valoraciones&action=traer_calificaciones&idCliente=${id_usuario}`
      )
        .then((response) => response.json())
        .then((data) => {
          const puntuaciones = data
            .map((item) => item.puntuacionCliente)
            .filter(
              (puntuacion) => puntuacion !== undefined && puntuacion !== null
            );
          const total = puntuaciones.reduce((acc, curr) => acc + curr, 0);
          const promedio = total / puntuaciones.length;
          setPromedios(promedio);
        })
        .catch((error) => console.error("Error al traer solicitud:", error));
    }
  }, [id_usuario]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenP, setIsOpenP] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const toggleDrawerP = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpenP(open);
  };

  const handleAlertClick = () => {
    setModalOpen(true);
  };

  //const handleOpenModal = () => {
  //setModalOpen(true);
  //};

  const handleCloseModal = () => {
    setModalOpen(false); // Cerrar el modal
    setAlarmReason("");
  };

  const handleAlarmReasonChange = (e) => {
    setAlarmReason(e.target.value); // Actualizar el estado con el texto ingresado
  };

  const handleActivateAlert = () => {
    // Lógica para activar la alarma
    setModalOpen(false);
    console.log("Alarma activada: ", motivoAlarma);
  };

  const handleConfirmAlarm = () => {
    if (!alarmReason.trim()) {
      alert("Por favor ingrese un motivo para activar la alarma.");
      return;
    }
    setIsAlarmActive(!isAlarmActive); // Cambiar el estado de la alarma a activa
    handleCloseModal();
    // Aquí puedes hacer cualquier lógica adicional para activar la alarma
  };

  const ModalBox = ({ children }) => (
    <Box sx={{ backgroundColor: "white", padding: 2, borderRadius: 2 }}>
      {children}
    </Box>
  );

  const getButtonColor = () => {
    return isAlarmActive ? "rgb(232, 92, 92, 1)" : "rgb(164,203,180)";
  };

  const list = () => (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <div className="row align-items-center text-center mt-3">
        <div className="col-md-5">
          <img
            src="/profile.png"
            alt="logo"
            className="img-fluid"
            style={{ maxWidth: "50%", height: "auto" }}
          />
          <p>
            {nombre} {apellido}
          </p>
        </div>
        <div className="col-md-7 marginLeft-rating">
          <Stack spacing={1} justifyContent="center" alignItems="center">
            <Rating
              name="size-medium"
              readOnly
              precision={0.5}
              defaultValue={promedios}
            />
          </Stack>
        </div>
      </div>
      <List>
        <Link href="/plataforma">
          <ListItem className="item-list">
            <ListItemIcon>
              <FaHome />
            </ListItemIcon>
            <ListItemText primary="Mis servicios" />
          </ListItem>
        </Link>
        <Link href="/registro-de-solicitudes">
          <ListItem className="item-list">
            <ListItemIcon>
              <FaInfoCircle />
            </ListItemIcon>
            <ListItemText primary="Registro de Solicitudes" />
          </ListItem>
        </Link>
        <Link href="/registro-quejas">
          <ListItem className="item-list">
            <ListItemIcon>
              <FaBriefcase />
            </ListItemIcon>
            <ListItemText primary="Registro Quejas" />
          </ListItem>
        </Link>
        <Link href="/visualizacion-solicitudes">
          <ListItem className="item-list">
            <ListItemIcon>
              <FaQuestionCircle />
            </ListItemIcon>
            <ListItemText primary="Historial" />
          </ListItem>
        </Link>
        <Link href="contacto">
          <ListItem className="item-list">
            <ListItemIcon>
              <FaEnvelope />
            </ListItemIcon>
            <ListItemText primary="Contacto" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <Link href="/perfil">
          <ListItem className="item-list">
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Perfil" />
          </ListItem>
        </Link>
        <Link href={DOMAIN_FRONT}>
          <ListItem className="item-list">
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </Link>

        <Link href="/activacion-de-alarma">
          <ListItem
            className="item-list"
            style={{ backgroundColor: "#f9f6f2", borderRadius: "8px" }}
          >
            <ListItemIcon>
              <FaPaw style={{ color: "#d97706", fontSize: "24px" }} />{" "}
              {/* Ícono de huella de perrito en color personalizado */}
            </ListItemIcon>
            <ListItemText primary="Slinky el perro" />
          </ListItem>
        </Link>
      </List>
    </Box>
  );

  const listP = () => (
    <Box
      sx={{ width: "100%" }}
      role="presentation"
      onClick={toggleDrawerP(false)}
      onKeyDown={toggleDrawerP(false)}
    >
      <List>
        <Link href="/plataforma-especialista">
          <ListItem className="item-list">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Especialista" />
          </ListItem>
        </Link>
        <Link href="/plataforma">
          <ListItem className="item-list">
            <ListItemIcon>
              <Person4Icon />
            </ListItemIcon>
            <ListItemText primary="Cliente" />
          </ListItem>
        </Link>
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer anchor={"left"} open={isOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      <Drawer anchor={"top"} open={isOpenP} onClose={toggleDrawerP(false)}>
        {listP()}
      </Drawer>
      <nav
        className={`${styles.navbar} navbar navbar-expand-lg navbar-dark`}
        style={{ marginBottom: "4em", padding: "0 1em" }}
      >
        <ul
          className="navbar-nav me-auto"
          style={{ listStyle: "none", display: "flex", alignItems: "center" }}
        >
          <li className="nav-item">
            <Button
              style={{ fontSize: "25px", color: "white", marginLeft: "-20px" }}
              onClick={toggleDrawer(true)}s
              className={`${styles.toggleButton} btn btn-link`}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </Button>
          </li>
        </ul>

        <div
          className="navbar-nav ms-auto"
          style={{ display: "flex", alignItems: "center", gap: "15px" }}
        >
          {/* Botón de notificaciones */}
          <Button
            className="btn btn-info mx-2"
            style={{ backgroundColor: getButtonColor() }}
            onClick={handleAlertClick}
          >
            <img src="/icons/alert.png" alt="Alerta" style={{ width: '20px', height: '21px' }} />
          </Button>

          {/* Modal de Confirmación */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>¿Está seguro que desea activar la alarma de emergencia?</h2>
            <textarea
              placeholder="Escriba un motivo para activar la alarma"
              value={alarmReason}
              onChange={(e) => setAlarmReason(e.target.value)}
            />
            <button onClick={handleCloseModal}>No, ignorar</button>
            <button onClick={handleConfirmAlarm}>Sí, activar</button>
          </div>
        </div>
      )}

          {/* Botón de alerta */}
          <Button
            className="btn btn-warning mx-2"
            onClick={handlePopoverOpen}
            style={{ display: "flex", alignItems: "center", width: "auto" }}
          >
            <img
              src="/icons/noti.png"
              alt="Alerta"
              style={{ width: "20px", height: "20px", color: "white" }}
            />
          </Button>
          {/* Botón del usuario con icono y nombre */}
          {/* <div className="d-flex align-items-center">
            <img src="/path/to/user-icon.png" alt="Usuario" className="rounded-circle" style={{ width: '30px', marginRight: '8px' }} />
            <span style={{ color: 'white', fontSize: '1em' }}>Usuario</span>
          </div> */}
        </div>

        <Popover
          open={openPopover}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box sx={{ padding: 2, minWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              Notificaciones
            </Typography>
            {notifications.length === 0 ? (
              <Typography variant="body2">
                No hay nuevas notificaciones.
              </Typography>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <Link key={notification.id} href={notification.link} passHref>
                    <Box
                      sx={{
                        padding: 1,
                        marginBottom: 1,
                        borderRadius: 1,
                        boxShadow: 1,
                        "&:hover": { backgroundColor: "#f1f1f1" },
                        cursor: "pointer",
                      }}
                    >
                      <Typography variant="subtitle1">
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {notification.message}
                      </Typography>
                    </Box>
                  </Link>
                ))}
              </div>
            )}
          </Box>
        </Popover>

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ padding: 2, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Notificaciones
          </Typography>
          {notifications.length === 0 ? (
            <Typography variant="body2">No hay nuevas notificaciones.</Typography>
          ) : (
            <div>
              {notifications.map((notification) => (
                <Link key={notification.id} href={notification.link} passHref>
                  <Box
                    sx={{
                      padding: 1,
                      marginBottom: 1,
                      borderRadius: 1,
                      boxShadow: 1,
                      '&:hover': { backgroundColor: '#f1f1f1' },
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="subtitle1">{notification.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {notification.message}
                    </Typography>
                  </Box>
                </Link>
              ))}
            </div>
          )}
        </Box>
      </Popover>

      </nav>
      <footer className={styles.footer}>
        <a>LA SEGURIDAD CIUDADANA ES TAREA DE TODOS NO DE UNA SOLA PERSONA</a>
      </footer>
    </div>
  );
};

export default Sidebar;
