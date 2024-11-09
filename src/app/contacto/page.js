import { useEffect, useState } from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { FaEnvelope, FaHome, FaUser } from 'react-icons/fa';
import { useJwt } from "react-jwt";
import { DOMAIN_BACK } from '../../../env';
import '../boostrap.css';
import Sidebar from '../components/sidebar';
import '../estilos/globales.css';
import useToken from '../utils/auth';
 
export default function Inicio() {
  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);
 
  const [key, setKey] = useState('home'); // Inicialización de la variable key
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
 
        <div className="row">
          <div className="col-3">1</div>
 
          <div className="col-6 text-center">
            <div className="row justify-content-center">
              <table className="table table-bordered text-center align-middle w-75">
                <tbody>
                  {/* Resto de las filas de la tabla */}
                </tbody>
              </table>
            </div>
          </div>
 
          <div className="col-3">3</div>
        </div>
 
        <div className="container mt-5">
          <Tab.Container id="left-tabs-example" activeKey={key} onSelect={(k) => setKey(k)}>
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="home">
                      <FaHome /> Home
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="profile">
                      <FaUser /> Profile
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="contact">
                      <FaEnvelope /> Contact
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="home">
                    <h3>Home</h3>
                    <p>This is the Home section.</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="profile">
                    <h3>Profile</h3>
                    <p>This is the Profile section.</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="contact">
                    <h3>Contact</h3>
                    <p>This is the Contact section.</p>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
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
