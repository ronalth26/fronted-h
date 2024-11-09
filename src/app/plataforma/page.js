'use client';

import { useEffect, useState } from 'react';
import { useJwt } from "react-jwt";
import { DOMAIN_BACK } from '../../../env';
import '../boostrap.css';
import Sidebar from '../components/sidebar';
import '../estilos/globales.css';
import useToken from '../utils/auth';
import { Nav, Tab, Row, Col } from 'react-bootstrap';
import { FaHome, FaUser, FaEnvelope } from 'react-icons/fa';
export default function Inicio() {


  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);



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

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />



      <div className="content layout-pages" style={{ marginBottom: '4rem' }}>

        <div class="row">
          <div class="col-3">1</div>

          <div class="col-6 text-center">

            <div class="row justify-content-center">
              <table class="table table-bordered text-center align-middle w-75">
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
                      <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="tooltip" title="Editar" style={{ width: '50px', height: '40px' }}>
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
                </tbody>
              </table>
            </div>



          </div>


          < div class="col-3">3</div>
          < div class="col-3">

          <img src='/icons/1.png' style={{width:'200px'}}></img>
          </div>
        </div>        


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
              <button className="btn btn-primary ms-2">
                <i className="fas fa-map-marker-alt"></i>+
              </button>
            </div>
            <div>
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


        {filteredServices.map(service => (
          <div key={service.idCategoria} className="col-md-4 mb-3">
            <a href={'/registro-de-solicitudes/' + service.idCategoria}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{service.nombreCategoria}</h5>
                  <p className="card-text">{service.count} encuentra especialistas</p>
                </div>
              </div>
            </a>
          </div>
        ))}

      </div>
    </>
  );
}