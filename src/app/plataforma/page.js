'use client';

import { useEffect, useState } from 'react';
import { useJwt } from "react-jwt";
import { DOMAIN_BACK } from '../../../env';
import '../boostrap.css';
import Sidebar from '../components/sidebar';
import '../estilos/globales.css';
import useToken from '../utils/auth';
import { Nav, Tab, Row, Col, Modal, Button } from 'react-bootstrap';
import { FaHome, FaUser, FaEnvelope } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Inicio() {
  const [showChat, setShowChat] = useState(false);
  const [showForm_NewPost, setshowForm_NewPost] = useState(false);
  const [showEdit, setEdit] = useState(false);
  const [showMaps, setMaps] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]); // Inicializa publicaciones como array vacío

  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);


  // Datos publicación
  async function obtenerPublicaciones() {
    try {
      const response = await fetch(`${DOMAIN_BACK}?controller=publicaciones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // Si la respuesta HTTP no es exitosa, lanzar un error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Verifica si la respuesta tiene la estructura esperada
      if (Array.isArray(data)) {
        console.log('Publicaciones:', data); // Imprime todas las publicaciones en consola
        // Aquí podrías manejar `data`, por ejemplo, renderizar en el DOM
        setPublicaciones(data); // pasar los datos de data a el array de publicaciones
      } else {
        console.error('Error al obtener publicaciones:', data.mensaje || 'Estructura de respuesta no esperada');
        if (typeof toast !== 'undefined') {
          toast.error(data.mensaje || 'Error desconocido al obtener publicaciones');
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      if (typeof toast !== 'undefined') {
        toast.error('Error al obtener publicaciones');
      }
    }
  }



  // Función para abrir el modal del chat
  const handleChatOpen = () => setShowChat(true);
  const handleChatOpen_NewPost = () => setshowForm_NewPost(true);
  const handleMaps = () => setMaps(true);
  const handleEdit = () => setEdit(true);

  // Función para cerrar el modal del chat
  const handleChatClose = () => setShowChat(false);
  const handleChatClose_NewPost = () => setshowForm_NewPost(false);
  const handleMapsClose = () => setMaps(false);
  const handleEditClose = () => setEdit(false);
  // useEffect(() => {
  //   if (isExpired || !decodedToken) {
  //     window.location.href = `${DOMAIN_FRONT}/login`;
  //   }
  // }, [isExpired, decodedToken]);
  const [key, setKey] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState(services);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallAlert, setShowInstallAlert] = useState(false);

  useEffect(() => {
    // Fetch categories from the backend
    fetch(DOMAIN_BACK + '?controller=categorias&action=traer_categorias')
      .then(response => response.json())
      .then(data => {
        setServices(data);
        setFilteredServices(data);
      })
      .catch(error => console.error('Error fetching services:', error));

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log(e);
      setShowInstallAlert(true);  // Show the install alert
    });

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowInstallAlert(false);  // Hide the install alert
    });
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = services.filter(service =>
      service.nombreCategoria.toLowerCase().includes(term)
    );
    setFilteredServices(filtered);
  };

  const handleClick = (serviceName) => {
    alert(`You clicked on ${serviceName}`);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsSidebarOpen(open);
  };

  const confirmAction = (serviceId) => {
    const isConfirmed = window.confirm(`¿Estás seguro de llamar al servicio ${serviceId}?`);
    if (isConfirmed) {
      // Aquí puedes ejecutar la acción que desees al confirmar
      alert(`Servicio ${serviceId} llamado.`);
    } else {
      alert(`No se ha llamado al servicio ${serviceId}.`);
    }
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowInstallAlert(false);
      });
    }
  };


  const locations = [
    {
      id: 1,
      name: "Comisaría Central",
      type: "Comisaría",
      position: { lat: -12.0464, lng: -77.0428 },
      address: "Calle Lima 123",
      phone: "+51 123 4567",
    },
    {
      id: 2,
      name: "Estación de Bomberos",
      type: "Bomberos",
      position: { lat: -12.0453, lng: -77.0308 },
      address: "Avenida Bomberos 456",
      phone: "+51 765 4321",
    },
    {
      id: 3,
      name: "Ambulancia de Emergencia",
      type: "Ambulancia",
      position: { lat: -12.0491, lng: -77.0348 },
      address: "Plaza San Miguel",
      phone: "+51 987 6543",
    },
  ];

  useEffect(() => {
    if (showMaps && !map) {
      const initMap = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: -12.0464, lng: -77.0428 },
        zoom: 14,
      });
      setMap(initMap);
    }
  }, [showMaps, map]);

  useEffect(() => {
    if (map) {
      markers.forEach((marker) => marker.setMap(null));
      const newMarkers = locations.map((location) => {
        const marker = new window.google.maps.Marker({
          position: location.position,
          map: map,
          title: location.name,
        });
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div>
                      <h5>${location.name}</h5>
                      <p>Tipo: ${location.type}</p>
                      <p>Dirección: ${location.address}</p>
                      <p>Teléfono: ${location.phone}</p>
                    </div>`,
        });
        marker.addListener("click", () => infoWindow.open(map, marker));
        return marker;
      });
      setMarkers(newMarkers);
    }
  }, [map]);

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />
      <div className="content layout-pages" style={{ marginBottom: '4rem', marginTop: '0px' }}>

        <div class="row">
          <div class="col-3"></div>

          <div class="col-6 text-center">

            <div class="row justify-content-center">


              <table className="table text-center align-middle w-75" style={{ color: "red", width: "10px" }}>

                <tbody>
                  <tr>
                    {/* <!-- Columna de servicio con ícono y nombre --> */}
                    <td class="d-flex align-items-center justify-content-center p-3">
                      <img src="/icons/bombero.png" width="28" class="me-2" alt="Bomberos"></img>
                      <span className="fw-bold" style={{ color: 'rgb(1, 37, 61)' }}>Bomberos</span>

                    </td>

                    {/* <!-- Columna de botones de llamada con colores y espaciado mejorado --> */}
                    <td>
                      <div class="d-flex justify-content-center gap-2">
                        <button
                          className="btn general-button"
                          onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip"
                          title="Llamar al servicio 1">
                          General
                        </button>
                        <button
                          className="btn regional-button" onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip" title="Llamar al servicio 2">
                          Distrital
                        </button>
                        <button
                          className="btn distrital-button" onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip" title="Llamar al servicio 3">
                          Provicial
                        </button>
                      </div>
                    </td>

                    {/* <!-- Columna de botón de editar con ícono --> */}
                    <td>
                      <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="tooltip" title="Editar" style={{ width: '50px', height: '40px' }}>
                        <img src="/icons/edit.png" width="20" alt="Editar" onClick={handleEdit}></img>
                      </button>
                    </td>

                    {/* <!-- Columna de botón de localizar con ícono --> */}

                    <td>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#mapsModal1"
                        title="Localizar"
                        style={{ width: '50px', height: '40px' }}
                      >
                        <img src="/icons/loc.png" width="20" alt="Localizar" />
                      </button>
                    </td>

                    {/* Modal de Bootstrap */}
                    <div
                      className="modal fade"
                      id="mapsModal1"
                      tabIndex="-1"
                      aria-labelledby="mapsModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="mapsModalLabel">
                              Ubicación de Bomberos en Arequipa, Perú
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <iframe
                              src="https://www.google.com/maps/embed/v1/view?key=AIzaSyA4Ek5gJPbNrIXnDOpEBKs6-HrmQ-fQTLg&center=-16.397122225147513,-71.53803574994112&zoom=19"

                              width="100%"
                              height="450"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>

                  </tr>

                  <tr>
                    {/* <!-- Columna de servicio con ícono y nombre --> */}
                    <td class="d-flex align-items-center justify-content-center p-3">
                      <img src="/icons/policia.png" width="28" class="me-2" alt="Bomberos"></img>
                      <span className="fw-bold" style={{ color: 'rgb(1, 37, 61)' }}>Comisaria</span>

                    </td>

                    {/* <!-- Columna de botones de llamada con colores y espaciado mejorado --> */}
                    <td>
                      <div class="d-flex justify-content-center gap-2">
                        <button
                          className="btn general-button"
                          onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip"
                          title="Llamar al servicio 1">
                          General
                        </button>
                        <button
                          className="btn regional-button" onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip" title="Llamar al servicio 2">
                          Distrital
                        </button>
                        <button
                          className="btn distrital-button" onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip" title="Llamar al servicio 3">
                          Provicial
                        </button>
                      </div>
                    </td>

                    {/* <!-- Columna de botón de editar con ícono --> */}
                    <td>
                      <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="tooltip" title="Editar" style={{ width: '50px', height: '40px' }}>
                        <img src="/icons/edit.png" width="20" alt="Editar" onClick={handleEdit}></img>
                      </button>
                    </td>

                    {/* <!-- Columna de botón de localizar con ícono --> */}
                    {/* <!-- Columna de botón de localizar con ícono --> */}
                    <td>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#mapsModal2"
                        title="Localizar"
                        style={{ width: '50px', height: '40px' }}
                      >
                        <img src="/icons/loc.png" width="20" alt="Localizar" />
                      </button>
                    </td>

                    {/* Modal de Bootstrap */}
                    <div
                      className="modal fade"
                      id="mapsModal2"
                      tabIndex="-1"
                      aria-labelledby="mapsModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="mapsModalLabel">
                              Ubicación de comisaria en Arequipa, Perú
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <iframe
                              src="https://www.google.com/maps/embed/v1/view?key=AIzaSyA4Ek5gJPbNrIXnDOpEBKs6-HrmQ-fQTLg&center=-16.401179623176528,-71.53591989553084&zoom=19"

                              width="100%"
                              height="450"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>

                  </tr>
                  <tr>
                    {/* <!-- Columna de servicio con ícono y nombre --> */}
                    <td class="d-flex align-items-center justify-content-center p-3">
                      <img src="/icons/ambulancia.png" width="28" class="me-2" alt="Bomberos"></img>
                      <span className="fw-bold" style={{ color: 'rgb(1, 37, 61)' }}>Ambulancia</span>

                    </td>

                    {/* <!-- Columna de botones de llamada con colores y espaciado mejorado --> */}
                    <td>
                      <div class="d-flex justify-content-center gap-2">
                        <button
                          className="btn general-button"
                          onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip"
                          title="Llamar al servicio 1">
                          General
                        </button>
                        <button
                          className="btn regional-button" onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip" title="Llamar al servicio 2">
                          Distrital
                        </button>
                        <button
                          className="btn distrital-button" onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip" title="Llamar al servicio 3">
                          Provicial
                        </button>
                      </div>
                    </td>

                    {/* <!-- Columna de botón de editar con ícono --> */}
                    <td>
                      <button class="btn btn-outline-secondary btn-sm" onClick={handleEdit} data-bs-toggle="tooltip" title="Editar" style={{ width: '50px', height: '40px' }}>
                        <img src="/icons/edit.png" width="20" alt="Editar"></img>
                      </button>
                    </td>

                    {/* <!-- Columna de botón de localizar con ícono --> */}
                    <td>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#mapsModal3"
                        title="Localizar"
                        style={{ width: '50px', height: '40px' }}
                      >
                        <img src="/icons/loc.png" width="20" alt="Localizar" />
                      </button>
                    </td>

                    {/* Modal de Bootstrap */}
                    <div
                      className="modal fade"
                      id="mapsModal3"
                      tabIndex="-1"
                      aria-labelledby="mapsModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="mapsModalLabel">
                              Ubicación de ambulancia en Arequipa, Perú
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <iframe
                              src="https://www.google.com/maps/embed/v1/view?key=AIzaSyA4Ek5gJPbNrIXnDOpEBKs6-HrmQ-fQTLg&center=-16.393243221147564,-71.53047237791604&zoom=19"

                              width="100%"
                              height="450"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>


                  </tr>
                  <tr>
                    {/* <!-- Columna de servicio con ícono y nombre --> */}
                    <td class="d-flex align-items-center justify-content-center p-3">
                      <img src="/icons/fa.png" width="28" class="me-2" alt="Bomberos"></img>
                      <span className="fw-bold" style={{ color: 'rgb(1, 37, 61)' }}>Familiares</span>

                    </td>

                    {/* <!-- Columna de botones de llamada con colores y espaciado mejorado --> */}
                    <td>
                      <div class="d-flex justify-content-center gap-2">
                        <button
                          className="btn general-button"
                          onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip"
                          title="Llamar al servicio 1">
                          General
                        </button>
                        <button
                          className="btn regional-button" onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip" title="Llamar al servicio 2">
                          Distrital
                        </button>
                        <button
                          className="btn distrital-button" onClick={() => confirmAction('1')}
                          data-bs-toggle="tooltip" title="Llamar al servicio 3">
                          Provicial
                        </button>
                      </div>
                    </td>

                    {/* <!-- Columna de botón de editar con ícono --> */}
                    <td>
                      <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="tooltip" title="Editar" style={{ width: '50px', height: '40px' }}>
                        <img src="/icons/edit.png" width="20" alt="Editar" onClick={handleEdit}></img>
                      </button>
                    </td>

                    {/* <!-- Columna de botón de localizar con ícono --> */}
                    <td>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#mapsModal4"
                        title="Localizar"
                        style={{ width: '50px', height: '40px' }}
                      >
                        <img src="/icons/loc.png" width="20" alt="Localizar" />
                      </button>
                    </td>

                    {/* Modal de Bootstrap */}
                    <div
                      className="modal fade"
                      id="mapsModal4"
                      tabIndex="-1"
                      aria-labelledby="mapsModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="mapsModalLabel">
                              Ubicación de de familiares en Arequipa, Perú
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <iframe
                              src="https://www.google.com/maps/embed/v1/view?key=AIzaSyA4Ek5gJPbNrIXnDOpEBKs6-HrmQ-fQTLg&center=-16.408968260986036,-71.54053285708898&zoom=19"

                              width="100%"
                              height="450"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>



          < div class="col-3">


          </div>
        </div>
        < div class="col-3">

        </div>
      </div>

      {/* Botón para abrir el chat */}
      <div
        className="chatbot-button"
        style={{
          position: 'fixed',
          bottom: '20px',
          marginBottom: '40px',
          right: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          padding: '15px',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        onClick={handleChatOpen}
      >
        <img
          src="/icons/3.png"
          alt="Chat Icon"
          style={{ width: '50px', height: '50px' }}
        />
      </div>
      {/* cerrar boton para modal */}


      {/* Modal del Chat */}
      <Modal show={showChat} onHide={handleChatClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              src="/icons/a1.png"
              alt="Chatbot"
              style={{ width: '40px', height: '40px', marginRight: '10px' }}
            />
            Chatbot
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div
            className="chat-box"
            style={{
              minHeight: '300px',
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '15px',
              backgroundColor: '#f1f1f1',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div className="chat-message bot-message">
              <p style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', borderRadius: '10px' }}>
                ¡Hola! ¿En qué puedo ayudarte hoy?
              </p>
            </div>
            <div className="chat-message user-message">
              <p
                style={{
                  backgroundColor: '#e2e2e2',
                  padding: '10px',
                  borderRadius: '10px',
                }}
              >
                ¿Cuáles son los servicios que ofreces?
              </p>
            </div>
            <div className="chat-message bot-message">
              <p style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', borderRadius: '10px' }}>
                Ofrecemos bomberos, policía, ambulancia, y más. ¿Te gustaría más información sobre algún servicio?
              </p>
            </div>

          </div>
          {/* fin modal */}

          {/* Campo de texto para la respuesta del usuario */}
          <div className="chat-input" style={{ marginTop: '15px' }}>
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              className="form-control"
              style={{
                borderRadius: '20px',
                padding: '10px',
                border: '1px solid #ccc',
              }}
            />
            <button
              className="btn btn-primary mt-2"
              style={{
                borderRadius: '20px',
                width: '100%',
                padding: '10px',
                fontSize: '16px',
              }}
            >
              Enviar
            </button>
          </div>
        </Modal.Body>

      </Modal>


      {/* Modal del formulario */}
      <Modal show={showForm_NewPost} onHide={handleChatClose_NewPost} size="lg">
        <Modal.Header closeButton>
          <img
            src="/icons/megafono.png"
            style={{ width: '40px', height: '40px', marginRight: '10px' }}
          />
          <Modal.Title style={{ paddingLeft: '230px' }}>
            ¡Nueva Publicación!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="category" style={{ marginBottom: 0, fontWeight: 'bold', flex: '0 0 120px' }}>Categoría: </label>
              <select
                className="form-control"
                id="category"
                style={{
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  fontSize: '16px',
                  marginBottom: '10px',
                  flex: 1, // hace que el select ocupe el espacio disponible
                }}
              >
                <option value="noticia">Noticia</option>
                <option value="afiche">Afiche</option>
                <option value="consejo">Consejo</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="title" style={{ marginBottom: 0, fontWeight: 'bold', flex: '0 0 120px' }}>Título: </label>
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Introduce el título"
                style={{
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  fontSize: '16px',
                  marginBottom: '10px',
                  flex: 1, // hace que el input ocupe el espacio disponible
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="date" style={{ marginBottom: 0, fontWeight: 'bold', flex: '0 0 120px' }}>Fecha: </label>
              <input
                type="date"
                className="form-control"
                id="date"
                style={{
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  fontSize: '16px',
                  marginBottom: '10px',
                  flex: 1, // hace que el input ocupe el espacio disponible
                }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="district" style={{ marginBottom: 0, fontWeight: 'bold', flex: '0 0 120px' }}>Distrito: </label>
              <select
                className="form-control"
                id="district"
                style={{
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  fontSize: '16px',
                  marginBottom: '10px',
                  flex: 1, // hace que el select ocupe el espacio disponible
                }}
              >
                <option value="arequipa">Arequipa</option>
                <option value="cayma">Cayma</option>
                <option value="cerro_colorado">Cerro Colorado</option>
                <option value="mariano_melgar">Mariano Melgar</option>
                <option value="miraflores">Miraflores</option>
                <option value="paucarpata">Paucarpata</option>
                <option value="sachaca">Sachaca</option>
                <option value="socabaya">Socabaya</option>
                <option value="yanahuara">Yanahuara</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description" style={{ fontWeight: 'bold' }}>Descripción:</label>
              <textarea
                className="form-control"
                id="description"
                rows="4"
                placeholder="Escribe una descripción"
                style={{
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  fontSize: '16px',
                  marginBottom: '10px',
                  width: '100%' // aseguramos que ocupe el espacio completo
                }}
              ></textarea>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label htmlFor="file" style={{ marginBottom: 0, fontWeight: 'bold', flex: '0 0 120px' }}>Imagen:</label>
              <input
                type="file"
                className="form-control-file"
                id="file"
                style={{
                  marginBottom: '10px',
                  width: '100%' // aseguramos que ocupe el espacio completo
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                padding: '10px',
                fontSize: '16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#007bff',
              }}
            >
              Publicar
            </button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Modal del formulario de editar */}
      <Modal show={showEdit} onHide={handleEditClose} size="lg">
        <Modal.Header closeButton>
          <img
            src="/publiciones/imagen1.png"
            style={{ width: '40px', height: '40px', marginRight: '10px' }}
          />

          <Modal.Title style={{ paddingLeft: '190px' }}>
            Editar Contactos de Emergencia
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              {/* Columna 1 */}
              <div className="col-md-6">
                <div className="form-group d-flex align-items-center mb-3">
                  <label htmlFor="contactName" className="flex-shrink-0 me-2" style={{ width: '120px', fontWeight: 'bold' }}>
                    <i className="bi bi-person-circle"></i> Nombre:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="contactName"
                    placeholder="Nombre del contacto"
                    style={{ flex: 1 }}
                  />
                </div>

                <div className="form-group d-flex align-items-center mb-3">
                  <label htmlFor="contactPhone" className="flex-shrink-0 me-2" style={{ width: '120px', fontWeight: 'bold' }}>
                    <i className="bi bi-telephone"></i> Teléfono:
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="contactPhone"
                    placeholder="Teléfono"
                    style={{ flex: 1 }}
                  />
                </div>

                <div className="form-group d-flex align-items-center mb-3">
                  <label htmlFor="contactEmail" className="flex-shrink-0 me-2" style={{ width: '120px', fontWeight: 'bold' }}>
                    <i className="bi bi-envelope"></i> Correo:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="contactEmail"
                    placeholder="Correo electrónico"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Columna 2 */}
              <div className="col-md-6">
                <div className="form-group d-flex align-items-center mb-3">
                  <label htmlFor="emergencyName" className="flex-shrink-0 me-2" style={{ width: '120px', fontWeight: 'bold' }}>
                    <i className="bi bi-person-badge"></i> Emergencia:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="emergencyName"
                    placeholder="Nombre del contacto de emergencia"
                    style={{ flex: 1 }}
                  />
                </div>

                <div className="form-group d-flex align-items-center mb-3">
                  <label htmlFor="emergencyPhone" className="flex-shrink-0 me-2" style={{ width: '120px', fontWeight: 'bold' }}>
                    <i className="bi bi-phone-vibrate"></i> Celular
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="emergencyPhone"
                    placeholder="Teléfono de emergencia"
                    style={{ flex: 1 }}
                  />
                </div>

                <div className="form-group d-flex align-items-center mb-3">
                  <label htmlFor="relation" className="flex-shrink-0 me-2" style={{ width: '120px', fontWeight: 'bold' }}>
                    <i className="bi bi-people"></i> Relación:
                  </label>
                  <select className="form-control" id="relation" style={{ flex: 1 }}>
                    <option value="familiar">Familiar</option>
                    <option value="amigo">Amigo</option>
                    <option value="trabajo">Trabajo</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              style={{
                padding: '10px',
                fontSize: '16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#007bff',
              }}
            >
              Guardar Cambios
            </button>
          </form>
        </Modal.Body>

      </Modal>

      {/* Modal del formulario de maps*/}
      <Modal show={showMaps} onHide={handleMapsClose} size="lg">
        <Modal.Header closeButton>
          <img
            src="/icons/maps.png"
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
            alt="Map Icon"
          />
          <Modal.Title>Ubicación más cercana</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="map" style={{ height: "500px", width: "100%" }}></div>
        </Modal.Body>
      </Modal>

      <div className="container my-4">
        {/* Top Navigation */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <label htmlFor="distrito" className="me-2">Distrito:</label>

            <div style={{ position: "relative", maxWidth: "200px" }}>
              <select
                id="distrito"
                className="form-control"
                style={{
                  width: "100%",
                  appearance: "none",       // Quita el estilo nativo
                  WebkitAppearance: "none",  // Compatibilidad en Safari
                  MozAppearance: "none",     // Compatibilidad en Firefox
                  backgroundColor: "#f8f9fa",
                  borderColor: "#ced4da",
                  paddingRight: "30px"      // Espacio para la flecha
                }}
                defaultValue=""
              >
                <option value="" disabled>Selecciona distrito</option>
                <option value="Arequipa">Arequipa</option>
                <option value="Cayma">Cayma</option>
                <option value="Cerro Colorado">Cerro Colorado</option>
                <option value="Mariano Melgar">Mariano Melgar</option>
                <option value="Miraflores">Miraflores</option>
                <option value="Paucarpata">Paucarpata</option>
                <option value="Sachaca">Sachaca</option>
                <option value="Socabaya">Socabaya</option>
                <option value="Yanahuara">Yanahuara</option>
                {/* Agrega más distritos según sea necesario */}
              </select>

              {/* Flecha personalizada */}
              <span style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                fontSize: "12px",
                color: "#6c757d"
              }}>▼</span>
            </div>
          </div>

          <div className="d-flex align-items-center">
            {/* Botón Nueva Publicación */}
            <button className="btn me-3" onClick={handleChatOpen_NewPost} style={{color:" rgba(5,29,64,255)",backgroundColor:"rgba(252,192,68,255)"}}>
              <i className="fas fa-plus"></i> Nueva Publicaciónn
            </button>

            {/* Botón Mis Publicaciones */}
            <button className="btn btn-outline-primary" style={{color:" rgba(5,29,64,255)",backgroundColor:"rgba(5,29,64,0)",borderColor:"rgba(5,29,64,255)"}}>
              <i className="fas fa-book"></i> Mis publicaciones
            </button>
          </div>
        </div>



        {/* Navigation Tabs */}
        <div className="container mt-5">
          <Tab.Container id="left-tabs-example" activeKey={key} onSelect={(k) => setKey(k)}>
            <Row>
              <Col sm={12}>
                {/* Horizontal buttons */}
                <Nav variant="pills" className="d-flex justify-content-start gap-3">
                  <Nav.Item>
                    <Nav.Link eventKey="noticias" className="btn-custom" onClick={obtenerPublicaciones} >
                      <i className="fas fa-newspaper"></i> Noticias
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="afiches" className="btn-custom" onClick={obtenerPublicaciones}>
                      <i className="fas fa-image"></i> Afiches
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="consejo" className="btn-custom" onClick={obtenerPublicaciones} >
                      <i className="fas fa-lightbulb"></i> Consejos
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>

              <Col sm={12}>


                <Tab.Content>
                  {/* Noticias Tab */}
                  <Tab.Pane eventKey="noticias">
                    {publicaciones.length > 0 ? (
                      publicaciones
                        .filter((publicacion) => publicacion.categoria === "Noticia") // Filtrar por categoría
                        .map((publicacion, index) => (
                          <div key={index} className="content-section card p-3 mb-3">

                            {/* Título dinámico */}
                            <h3 className="mb-2 text-center">{publicacion.titulo}</h3>

                            {/* Fecha y distrito dinámicos */}
                            <p className="text-muted text-center">
                              <strong>Fecha:</strong> {publicacion.fecha} &nbsp; | &nbsp;
                              <strong>Distrito:</strong> {publicacion.distrito}
                            </p>

                            {/* Descripción dinámica */}
                            <p className="text-center mb-3">{publicacion.descripcion}</p>

                            <div className="d-flex flex-column align-items-center">
                              {/* Imagen dinámica */}
                              <img
                                src={publicacion.imagen}
                                alt={`Imagen de ${publicacion.titulo}`}
                                className="img-thumbnail mb-3"
                                style={{ maxWidth: "500px" }}
                              />

                              <div className="d-flex align-items-center">
                                <div className="star-rating d-flex align-items-center me-3">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} style={{ color: "#ffc107", fontSize: "1.5rem" }}>★</span>
                                  ))}
                                </div>

                                <div className="d-flex flex-column align-items-center">
                                  <button className="btn btn-outline-primary d-flex align-items-center">
                                    <span role="img" aria-label="share" style={{ fontSize: "1.5rem" }}>📤</span>
                                  </button>
                                  <small>Compartir</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center">No hay publicaciones disponibles.</p>
                    )}
                  </Tab.Pane>



                  {/* Afiches Tab */}
                  <Tab.Pane eventKey="afiches">
                    {publicaciones.length > 0 ? (
                      publicaciones
                        .filter((afiche) => afiche.categoria === "Afiche") // Filtrar por categoría "afiche"
                        .map((afiche, index) => (
                          <div key={index} className="content-section card p-3 mb-3">

                            {/* Título dinámico */}
                            <h3 className="mb-2 text-center">{afiche.titulo}</h3>

                            {/* Fecha y distrito dinámicos */}
                            <p className="text-muted text-center">
                              <strong>Fecha:</strong> {afiche.fecha} &nbsp; | &nbsp;
                              <strong>Distrito:</strong> {afiche.distrito}
                            </p>

                            {/* Descripción dinámica */}
                            <p className="text-center mb-3">{afiche.descripcion}</p>

                            <div className="d-flex flex-column align-items-center">
                              {/* Imagen dinámica */}
                              <img
                                src={afiche.imagen}
                                alt={`Imagen de ${afiche.titulo}`}
                                className="img-thumbnail mb-3"
                                style={{ maxWidth: "500px" }}
                              />

                              <div className="d-flex align-items-center">
                                <div className="star-rating d-flex align-items-center me-3">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} style={{ color: "#ffc107", fontSize: "1.5rem" }}>★</span>
                                  ))}
                                </div>

                                <div className="d-flex flex-column align-items-center">
                                  <button className="btn btn-outline-primary d-flex align-items-center">
                                    <span role="img" aria-label="share" style={{ fontSize: "1.5rem" }}>📤</span>
                                  </button>
                                  <small>Compartir</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center">No hay afiches disponibles.</p>
                    )}
                  </Tab.Pane>



                  {/* Consejos Tab */}
                  <Tab.Pane eventKey="consejo">
                    {publicaciones.length > 0 ? (
                      publicaciones
                        .filter((consejo) => consejo.categoria === "Consejo") // Filtrar por categoría "consejo"
                        .map((consejo, index) => (
                          <div key={index} className="content-section card p-3 mb-3">

                            {/* Título dinámico */}
                            <h3 className="mb-2 text-center">{consejo.titulo}</h3>

                            {/* Fecha y distrito dinámicos */}
                            <p className="text-muted text-center">
                              <strong>Fecha:</strong> {consejo.fecha} &nbsp; | &nbsp;
                              <strong>Distrito:</strong> {consejo.distrito}
                            </p>

                            {/* Descripción dinámica */}
                            <p className="text-center mb-3">{consejo.descripcion}</p>

                            <div className="d-flex flex-column align-items-center">
                              {/* Imagen dinámica */}
                              <img
                                src={consejo.imagen}
                                alt={`Imagen de ${consejo.titulo}`}
                                className="img-thumbnail mb-3"
                                style={{ maxWidth: "500px" }}
                              />

                              <div className="d-flex align-items-center">
                                <div className="star-rating d-flex align-items-center me-3">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} style={{ color: "#ffc107", fontSize: "1.5rem" }}>★</span>
                                  ))}
                                </div>

                                <div className="d-flex flex-column align-items-center">
                                  <button className="btn btn-outline-primary d-flex align-items-center">
                                    <span role="img" aria-label="share" style={{ fontSize: "1.5rem" }}>📤</span>
                                  </button>
                                  <small>Compartir</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-center">No hay consejos disponibles.</p>
                    )}
                  </Tab.Pane>


                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>







    </>
  );




}