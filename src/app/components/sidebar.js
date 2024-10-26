// Sidebar.js
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaBriefcase, FaQuestionCircle, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import BuildIcon from '@mui/icons-material/Build';
import styles from './sidebar.module.css';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import PersonIcon from '@mui/icons-material/Person';
import Person4Icon from '@mui/icons-material/Person4';
import './listaSidebar.css';
import '../estilos/globales.css';
import { DOMAIN_FRONT, DOMAIN_BACK } from '../../../env';
import useToken from '../utils/auth';
import { useJwt } from "react-jwt";

const Sidebar = () => {
  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);

  useEffect(() => {
    if (Token == null) {
      console.log('Token has expired, redirecting to login page.');
      window.location.href = `${DOMAIN_FRONT}`;
    }
  }, [isExpired]);

  useEffect(() => {
    if (Token == null || isExpired) {
      console.log('Token has expired, redirecting to login page.');
      // window.location.href = `${DOMAIN_FRONT}`;
    }
  }, [Token, isExpired]);
  

  useEffect(() => {
    // console.log('Token expiration status:', isExpired);
  }, [isExpired]);
  

  const [id_usuario, setIdUsuario] = useState(0);
  const [especialista, setEspecialista] = useState(0);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

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
      fetch(`${DOMAIN_BACK}?controller=valoraciones&action=traer_calificaciones&idCliente=${id_usuario}`)
        .then(response => response.json())
        .then(data => {
          const puntuaciones = data.map(item => item.puntuacionCliente).filter(puntuacion => puntuacion !== undefined && puntuacion !== null);
          const total = puntuaciones.reduce((acc, curr) => acc + curr, 0);
          const promedio = total / puntuaciones.length;
          setPromedios(promedio);
        })
        .catch(error => console.error('Error al traer solicitud:', error));
    }
  }, [id_usuario]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenP, setIsOpenP] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const toggleDrawerP = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpenP(open);
  };

  const list = () => (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <div className="row align-items-center text-center mt-3">
        <div className="col-md-5">
          <img src="/profile.png" alt="logo" className="img-fluid" style={{ maxWidth: '50%', height: 'auto' }} />
          <p>{nombre} {apellido}</p>
        </div>
        <div className="col-md-7 marginLeft-rating">
          <Stack spacing={1} justifyContent="center" alignItems="center">
            <Rating name="size-medium" readOnly precision={0.5} defaultValue={promedios} />
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
      </List>
    </Box>
  );

  const listP = () => (
    <Box sx={{ width: '100%' }} role="presentation" onClick={toggleDrawerP(false)} onKeyDown={toggleDrawerP(false)}>
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
      <Drawer anchor={'left'} open={isOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      <Drawer anchor={'top'} open={isOpenP} onClose={toggleDrawerP(false)}>
        {listP()}
      </Drawer>
      <nav className={styles.navbar} style={{ marginBottom: '4em' }}>
        <div className="logo">
          <a href={`${DOMAIN_FRONT}plataforma`}>
            <img src="/logo_work.png" alt="logo" className={styles.logo} width={'30%'} />
          </a>
        </div>
        <Button className={styles.clientButton}>
          <span style={{ fontSize: '15px', backgroundColor: '#fff', color: '#000', borderRadius: '20px', padding: '10px 20px' }} onClick={toggleDrawerP(true)} className={styles.clientText}>
            Cliente <FaChevronDown className={styles.downArrow} />
          </span>
        </Button>
        <ul style={{ listStyle: 'none', marginTop: '15px' }}>
          <li style={{ listStyle: 'none' }}>
            <Button style={{ fontSize: '25px', backgroundColor: '#fff', color: '#000' }} onClick={toggleDrawer(true)} className={styles.toggleButton}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </Button>
          </li>
        </ul>
      </nav>
      <footer className={styles.footer}>
        <a href='/plataforma'><button className={styles.footerButton}>Servicios</button></a>
        <a href='/visualizacion-solicitudes'><button className={styles.footerButton}>Mis solicitudes</button></a>
      </footer>
    </div>
  );
};

export default Sidebar;