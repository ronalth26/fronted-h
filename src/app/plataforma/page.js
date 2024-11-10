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


export default function Inicio() {
  const [showChat, setShowChat] = useState(false);
  const [showForm_NewPost, setshowForm_NewPost] = useState(false);
  const [showEdit, setEdit] = useState(false);
  const [showMaps, setMaps] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);

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
      <div className="content layout-pages" style={{ marginBottom: '4rem' }}>

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
                      <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="tooltip" title="Localizar" style={{ width: '50px', height: '40px' }}>
                        <img src="/icons/loc.png" width="20" alt="Localizar"></img>
                      </button>
                    </td>
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
                    <td>
                      <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="tooltip" title="Localizar" style={{ width: '50px', height: '40px' }}>
                        <img src="/icons/loc.png" width="20" alt="Localizar"></img>
                      </button>
                    </td>
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
                      <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="tooltip" title="Localizar" style={{ width: '50px', height: '40px' }}>
                        <img src="/icons/loc.png" width="20" alt="Localizar"></img>
                      </button>
                    </td>
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
                      <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="tooltip" title="Localizar" style={{ width: '50px', height: '40px' }}>
                        <img src="/icons/loc.png" width="20" alt="Localizar" onClick={handleMaps}></img>
                      </button>
                    </td>
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
            src="/icons/edit.png"
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
            <label className="me-2">Distrito:</label>
            <input
              type="text"
              className="form-control"
              placeholder="Selecciona distrito"
              style={{
                maxWidth: "200px",
                backgroundColor: "#f8f9fa", // Light gray background for the input
                borderColor: "#ced4da" // Light border color for contrast
              }}
              list="distritos" // Links input to the datalist below
            />
            <datalist id="distritos">
              <option value="Arequipa" />
              <option value="Cayma" />
              <option value="Cerro Colorado" />
              <option value="Mariano Melgar" />
              <option value="Miraflores" />
              <option value="Paucarpata" />
              <option value="Sachaca" />
              <option value="Socabaya" />
              <option value="Yanahuara" />
              {/* Add more districts as needed */}
            </datalist>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Botón Nueva Publicación */}
            <button className="btn btn-primary me-3" onClick={handleChatOpen_NewPost}>
              <i className="fas fa-plus"></i> Nueva Publicación
            </button>

            {/* Botón Mis Publicaciones */}
            <button className="btn btn-outline-primary">
              <i className="fas fa-plus"></i> Mis publicaciones
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
                    <Nav.Link eventKey="noticias" className="btn-custom">
                      <i className="fas fa-newspaper"></i> Noticias
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="afiches" className="btn-custom">
                      <i className="fas fa-image"></i> Afiches
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="consejo" className="btn-custom">
                      <i className="fas fa-lightbulb"></i> Consejos
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>

              <Col sm={12}>
                <Tab.Content>
                  {/* Noticias Tab */}
                  <Tab.Pane eventKey="noticias">
                    <div className="content-section card p-3 mb-3">
                      <h3 className="mb-2 text-center">Título de la Noticia</h3>

                      {/* Fecha y Distrito */}
                      <p className="text-muted text-center"><strong>Fecha:</strong> 09 Noviembre 2024 &nbsp; | &nbsp; <strong>Distrito:</strong> Arequipa</p>

                      {/* Descripción */}
                      <p className="text-center mb-3">Breve descripción de la noticia que da una idea general del contenido.</p>

                      {/* Estrellas y botón debajo de la imagen */}
                      <div className="d-flex flex-column align-items-center">
                        {/* Imagen */}
                        <img src="https://via.placeholder.com/150" alt="Imagen de Noticia" className="img-thumbnail mb-3" style={{ maxWidth: "150px" }} />

                        {/* Estrellas y botón de compartir al lado */}
                        <div className="d-flex align-items-center">
                          {/* Estrellas */}
                          <div className="star-rating d-flex align-items-center me-3">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: "#ffc107", fontSize: "1.5rem" }}>★</span>
                            ))}
                          </div>

                          {/* Botón de Compartir */}
                          <div className="d-flex flex-column align-items-center">
                            <button className="btn btn-outline-primary d-flex align-items-center">
                              <span role="img" aria-label="share" style={{ fontSize: "1.5rem" }}>📤</span>
                            </button>
                            <small>Compartir</small>
                          </div>
                        </div>

                      </div>

                    </div>
                  </Tab.Pane>

                  {/* Afiches Tab */}
                  <Tab.Pane eventKey="afiches">
                    <div className="content-section card p-3 mb-3">
                      <h3 className="mb-2 text-center">Título de la Afiche</h3>

                      {/* Fecha y Distrito */}
                      <p className="text-muted text-center"><strong>Fecha:</strong> 09 Noviembre 2024 &nbsp; | &nbsp; <strong>Distrito:</strong> Arequipa</p>

                      {/* Descripción */}
                      <p className="text-center mb-3">Breve descripción del afiche que da una idea general del contenido.</p>

                      {/* Estrellas y botón debajo de la imagen */}
                      <div className="d-flex flex-column align-items-center">
                        {/* Imagen */}
                        <img src="https://via.placeholder.com/150" alt="Imagen de Afiche" className="img-thumbnail mb-3" style={{ maxWidth: "150px" }} />

                        {/* Estrellas y botón de compartir al lado */}
                        <div className="d-flex align-items-center">
                          {/* Estrellas */}
                          <div className="star-rating d-flex align-items-center me-3">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: "#ffc107", fontSize: "1.5rem" }}>★</span>
                            ))}
                          </div>

                          {/* Botón de Compartir */}
                          <div className="d-flex flex-column align-items-center">
                            <button className="btn btn-outline-primary d-flex align-items-center">
                              <span role="img" aria-label="share" style={{ fontSize: "1.5rem" }}>📤</span>
                            </button>
                            <small>Compartir</small>
                          </div>
                        </div>

                      </div>

                    </div>
                  </Tab.Pane>

                  {/* Consejos Tab */}
                  <Tab.Pane eventKey="consejo">
                    <div className="content-section card p-3 mb-3">
                      <h3 className="mb-2 text-center">Título de la Consejo</h3>

                      {/* Fecha y Distrito */}
                      <p className="text-muted text-center"><strong>Fecha:</strong> 09 Noviembre 2024 &nbsp; | &nbsp; <strong>Distrito:</strong> Arequipa</p>

                      {/* Descripción */}
                      <p className="text-center mb-3">Breve descripción del consejo que da una idea general del contenido.</p>

                      {/* Estrellas y botón debajo de la imagen */}
                      <div className="d-flex flex-column align-items-center">
                        {/* Imagen */}
                        <img src="https://via.placeholder.com/150" alt="Imagen del Consejo" className="img-thumbnail mb-3" style={{ maxWidth: "150px" }} />

                        {/* Estrellas y botón de compartir al lado */}
                        <div className="d-flex align-items-center">
                          {/* Estrellas */}
                          <div className="star-rating d-flex align-items-center me-3">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{ color: "#ffc107", fontSize: "1.5rem" }}>★</span>
                            ))}
                          </div>

                          {/* Botón de Compartir */}
                          <div className="d-flex flex-column align-items-center">
                            <button className="btn btn-outline-primary d-flex align-items-center">
                              <span role="img" aria-label="share" style={{ fontSize: "1.5rem" }}>📤</span>
                            </button>
                            <small>Compartir</small>
                          </div>
                        </div>

                      </div>

                    </div>
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