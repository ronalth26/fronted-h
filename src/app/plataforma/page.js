'use client';

import React, { useState, useEffect } from 'react';
import '../boostrap.css';
import Sidebar from '../components/sidebar';
import '../estilos/globales.css';
import { DOMAIN_BACK, DOMAIN_FRONT } from '../../../env';
import useToken  from '../utils/auth';
import { useJwt } from "react-jwt";

export default function Inicio() {


  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);



  // useEffect(() => {
  //   if (isExpired || !decodedToken) {
  //     window.location.href = `${DOMAIN_FRONT}/login`;
  //   }
  // }, [isExpired, decodedToken]);

  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState(services);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallAlert, setShowInstallAlert] = useState(false);

  useEffect(() => {
    // Fetch categories from the backend
    fetch(DOMAIN_BACK+'?controller=categorias&action=traer_categorias')
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
        <h3 className='color-primary text-center'><b>Empieza a solicitar tus servicios</b></h3>
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <input
              type="text"
              placeholder="¿Qué servicio estás buscando?"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control"
            />
          </div>
        </div>
        {showInstallAlert && (
          <div className="alert alert-info text-center" role="alert">
            <p>Instala nuestra aplicación para una mejor experiencia.</p>
            <button className="btn btn-primary" onClick={handleInstallClick}>Instalar</button>
          </div>
        )}
        <div className="row">
          {filteredServices.map(service => (
            <div key={service.idCategoria} className="col-md-4 mb-3">
              <a href={'/registro-de-solicitudes/'+service.idCategoria}>
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
      </div>
    </>
  );
}
