'use client';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/sidebar';
import '../RegistroSolicitud.css';
import { DOMAIN_FRONT, DOMAIN_BACK } from '../../../../env';
import useToken  from '../../utils/auth';
import { useJwt } from "react-jwt";


import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ChangeMapView = ({ coords }) => {
  const map = useMap();
  map.setView(coords, map.getZoom());
  return null;
};

const RegistroSolicitud = ({ params }) => {

  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);

  // useEffect(() => {
  //   if (isExpired || !decodedToken) {
  //     window.location.href = `${DOMAIN_FRONT}/login`;
  //   }
  // }, [isExpired, decodedToken]);

  const id_categoria = params.categoria;

  const [position, setPosition] = useState([51.505, -0.09]); // Default position
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    categoriaServicio: id_categoria,
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

    fetch(`${DOMAIN_BACK}?controller=servicios&action=traer_servicios&idCategoria=${id_categoria}`)
      .then(response => response.json())
      .then(data => setServicios(data))
      .catch(error => console.error('Error al obtener servicios:', error));
  }, [id_categoria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'categoriaServicio') {
      fetch(`${DOMAIN_BACK}?controller=servicios&action=traer_servicios&idCategoria=${value}`)
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
    if (decodedToken) {
      setIdUsuario(decodedToken.data.id);
      setEspecialista(decodedToken.data.especialista);
    }
  }, [decodedToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(`${DOMAIN_BACK}?controller=solicitudes&action=crear_solicitud`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idCliente: id_usuario,
            idServicio,
            descripcionServicio,
            direccion,
            lat_long: JSON.stringify(position),
            fechaHoraSolicitud:fechaHoraAtencion,
            precio,
          }),
        });
        const data = await response.json();
        if (data.estado === 1) {
          toast.success(data.mensaje);
           setTimeout(() => {
             window.location.href = DOMAIN_FRONT+'plataforma';
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

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
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
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setSearchQuery(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          alert('Error al obtener la ubicación');
        }
      );
    } else {
      alert('Geolocalización no es soportada por este navegador');
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
                        <option value="">Seleccione una categoría</option>
                        {categorias.map(categoria => (
                          <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Seleccione el servicio</label>
                      <select
                        className="form-control p-2"
                        name="idServicio"
                        value={idServicio}
                        onChange={handleChangeServicio}
                      >
                        <option value="">Seleccione un servicio</option>
                        {servicios.map(servicio => (
                          <option key={servicio.idServicio} value={servicio.idServicio}>{servicio.nombreServicio}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Descripción servicio</label>
                      <textarea
                        className="form-control p-2"
                        name="descripcionServicio"
                        value={descripcionServicio}
                        onChange={(e) => setDescripcionServicio(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Dirección</label>
                      <input
                        type="text"
                        className="form-control p-2"
                        name="direccion"
                        value={direccion}
                        onChange={(e) => {
                          setDireccion(e.target.value);
                          setSearchQuery(e.target.value);
                        }}
                      />
                    </div>
                    <div className="form-group mt-3">
                      <button type="button" className="btn btn-primary form-control" onClick={handleClickOpen}>
                        Marcar Ubicación
                      </button>
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>Fecha y Hora</label>
                      <input
                        type="datetime-local"
                        className="form-control p-2"
                        name="fechaHoraAtencion"
                        value={fechaHoraAtencion}
                        onChange={(e) => setFechaHoraAtencion(e.target.value)}
                      />
                    </div>
                    <div className="form-group mt-3">
                      <label style={{ color: '#000' }}>(S/.) Precio</label>
                      <input
                        type="text"
                        className="form-control p-2"
                        name="precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="form-control btn btn-primary rounded submit px-3">
                      Registrar Solicitud
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Busca tu dirección en el mapa para poder localizarte"}
        </DialogTitle>
        <DialogContent>
          <input
            type="text"
            className="form-control p-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar dirección"
          />
          <button className="btn btn-primary mb-4 mt-2" onClick={handleSearch}>Buscar</button>
          <div className="form-group mt-3">
            <button type="button" className="btn btn-secondary form-control" onClick={handleCurrentLocation}>
              Usar mi Ubicación Actual
            </button>
          </div>
          <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%', marginTop: '20px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }}>
              <Popup>Ubicación buscada</Popup>
            </Marker>
            <ChangeMapView coords={position} />
          </MapContainer>
        </DialogContent>
        <DialogActions>
          <Button className='btn btn-primary' onClick={handleClose} autoFocus>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegistroSolicitud;
