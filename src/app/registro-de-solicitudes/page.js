'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../components/sidebar';
import './RegistroSolicitud.css';
import { DOMAIN_FRONT, DOMAIN_BACK } from '../../../env';
import useIsClient from '../../hooks/useIsCLient';
import useToken  from '../utils/auth';
import { useJwt } from "react-jwt";


import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// MAPA LEAFLET
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then(mod => mod.useMap), { ssr: false });
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Configuración del icono del marcador
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Componente para mover el mapa a la nueva posición
const ChangeMapView = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (map && map.setView) {
      map.setView(coords, map.getZoom());
    }
  }, [map, coords]);

  return null;
};

const RegistroSolicitud = () => {

  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);


  // useEffect(() => {
  //   if (isExpired || !decodedToken) {
  //     window.location.href = `${DOMAIN_FRONT}/login`;
  //   }
  // }, [isExpired, decodedToken]);

  const isClient = useIsClient(); // Usa el hook personalizado

  const [position, setPosition] = useState([51.505, -0.09]); // Ubicación inicial (Londres)
  const [searchQuery, setSearchQuery] = useState('');

  // Obtener ubicación actual al cargar la página
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
      }, (error) => {
        console.error('Error al obtener la ubicación:', error);
        alert('Error al obtener la ubicación');
      });
    } else {
      alert('Geolocalización no es soportada por este navegador');
    }
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        // setSearchQuery(`${lat}, ${lon}`);
      } else {
        alert('No se encontraron resultados');
      }
    } catch (error) {
      console.error('Error al buscar la dirección:', error);
    }
  };

  const handleMarkerDragEnd = (event) => {
    const newPosition = event.target.getLatLng();
    setPosition([newPosition.lat, newPosition.lng]);
    // setSearchQuery(`${newPosition.lat}, ${newPosition.lng}`);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        // setSearchQuery(`${latitude}, ${longitude}`);
      }, (error) => {
        console.error('Error al obtener la ubicación:', error);
        alert('Error al obtener la ubicación');
      });
    } else {
      alert('Geolocalización no es soportada por este navegador');
    }
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    categoriaServicio: '',
  });

  const [categorias, setCategorias] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [idServicio, setIdServicio] = useState('');
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaHoraAtencion, setFechaHoraAtencion] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    fetch(`${DOMAIN_BACK}?controller=categorias&action=traer_categorias`)
      .then(response => response.json())
      .then(data => setCategorias(data))
      .catch(error => console.error('Error al obtener categorías:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (isClient && e.target.name === 'categoriaServicio') {
      fetch(`${DOMAIN_BACK}?controller=servicios&action=traer_servicios&idCategoria=${e.target.value}`)
        .then(response => response.json())
        .then(data => setServicios(data))
        .catch(error => console.error('Error al obtener servicios:', error));
    }
  };

  const handleChangeServicio = (e) => {
    setIdServicio(e.target.value);
  };

  const validateForm = () => {
    if (!idServicio || !descripcionServicio || !direccion || !fechaHoraAtencion || !precio) {
      toast.error('Todos los campos son obligatorios');
      return false;
    }
    if (new Date(fechaHoraAtencion) <= new Date()) {
      toast.error('La fecha y hora deben ser futuras');
      return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(precio)) {
      toast.error('El precio debe ser un valor monetario válido');
      return false;
    }
    return true;
  };

  const [id_usuario, setIdUsuario] = useState(0);
  const [especialista, setEspecialista] = useState(0);

  useEffect(() => {
    if (isClient && decodedToken) {
      setIdUsuario(decodedToken.data.id);
      setEspecialista(decodedToken.data.especialista);
    }
  }, [isClient, decodedToken]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(`${DOMAIN_BACK}?controller=solicitudes&action=crear_solicitud`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idCliente: id_usuario,
            idServicio: idServicio,
            descripcionServicio: descripcionServicio,
            direccion: direccion,
            lat_long: JSON.stringify(position),
            fechaHoraSolicitud: fechaHoraAtencion,
            precio: precio
          })
        });
        const data = await response.json();
        console.log(data);
        if (data.estado === 1) {
          toast.success(data.mensaje);
          setTimeout(() => {
            window.location.href = DOMAIN_FRONT + 'plataforma';
          }, 2000);
        } else {
          toast.error(data.mensaje);
        }
      } catch (error) {
        console.error('Error al registrar la solicitud:', error);
        toast.error('Error al registrar la solicitud');
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Sidebar />
      <section className="profile-section" style={{ marginTop: '8rem' }}>
        <div className="container" style={{ marginTop: '4rem' }}>
          <div className="row justify-content-center">
            <div className="col-md-7 col-lg-5">
              <div className="wrap">
                <div className="profile-wrap p-4 p-md-5">
                  <center>
                    <h3 className="form-title"><b>Registro de Solicitud</b></h3>
                  </center>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Seleccione la categoría de servicio</label>
                      <select
                        className="form-control p-2"
                        name="categoriaServicio"
                        value={formData.categoriaServicio}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar Categoría</option>
                        {categorias.map(categoria => (
                          <option key={categoria.idCategoria} value={categoria.idCategoria}>
                            {categoria.nombreCategoria}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Seleccione el Servicio</label>
                      <select
                        className="form-control p-2"
                        name="idServicio"
                        value={idServicio}
                        onChange={handleChangeServicio}
                      >
                        <option value="">Seleccionar Servicio</option>
                        {servicios.map(servicio => (
                          <option key={servicio.idServicio} value={servicio.idServicio}>
                            {servicio.nombreServicio}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Descripción del Servicio</label>
                      <textarea
                        className="form-control p-2"
                        placeholder="Escriba la descripción"
                        name="descripcionServicio"
                        value={descripcionServicio}
                        onChange={e => setDescripcionServicio(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Dirección</label>
                      <input
                        type="text"
                        className="form-control p-2"
                        placeholder="Escriba la dirección"
                        name="direccion"
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                      />
                      <div className="input-group-append">
                        <Button variant="contained" onClick={handleClickOpen}>Ubicación</Button>
                      </div>
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Fecha y Hora de Atención</label>
                      <input
                        type="datetime-local"
                        className="form-control p-2"
                        placeholder="Seleccione fecha y hora"
                        name="fechaHoraAtencion"
                        value={fechaHoraAtencion}
                        onChange={e => setFechaHoraAtencion(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Precio</label>
                      <input
                        type="text"
                        className="form-control p-2"
                        placeholder="Escriba el precio"
                        name="precio"
                        value={precio}
                        onChange={e => setPrecio(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-3">
                      <button type="submit" className="form-control btn btn-primary rounded submit px-3">
                        Registrar
                      </button>
                    </div>
                  </form>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Ubicación</DialogTitle>
                    <DialogContent>
                      <div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Buscar dirección"
                        />
                        <Button variant="contained" onClick={handleSearch}>Buscar</Button>
                        <Button variant="contained" onClick={handleCurrentLocation}>Ubicación Actual</Button>
                      </div>
                      {isClient && (
                        <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker
                            position={position}
                            draggable={true}
                            eventHandlers={{
                              dragend: handleMarkerDragEnd,
                            }}
                          >
                            <Popup>Ubicación seleccionada</Popup>
                          </Marker>
                          <ChangeMapView coords={position} />
                        </MapContainer>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose}>Cancelar</Button>
                      <Button onClick={() => { handleClose(); setDireccion(searchQuery); }}>Guardar</Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegistroSolicitud;
