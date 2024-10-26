'use client';

import React, { useState,useEffect } from 'react';
import '../boostrap.css';
import SidebarEspecialista from '../components/sidebarEspecialista';
import '../estilos/globales.css';
import './platform-especialista.css';
import { DOMAIN_BACK } from '../../../env';
import useToken  from '../utils/auth';
import { useJwt } from "react-jwt";

export default function PlataformaEspecialista() {


  // useEffect(() => {
  //   if (isExpired || !decodedToken) {
  //     window.location.href = `${DOMAIN_FRONT}/login`;
  //   }
  // }, [isExpired, decodedToken]);

  

  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);

  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 
  const [filteredServices, setFilteredServices] = useState([]);



       const filtrarServiciosCorrectos = (data) => {
         const filteredData = data.filter(item => {
           const isEstadoEqualToOne = item.estado == "1";
           const isFechaHoraSolicitudVigente = new Date(item.fechaHoraSolicitud) >= new Date();
           return isEstadoEqualToOne && isFechaHoraSolicitudVigente;
         });
       
         return filteredData;
       };



      // TRAER LAS SOLICITUDES
        
     
      useEffect(() => {
       // Fetch categories from the backend
       fetch(DOMAIN_BACK+'?controller=solicitudes&action=traer_solicitudes')
         .then(response => response.json())
         .then(data => {


           console.log(data);
             
           const serviciosCorrectos = filtrarServiciosCorrectos(data);
          setFilteredServices(serviciosCorrectos)
         })
         .catch(error => console.error('Error al traer solicitud:', error));
     
     }, []);
 




 

     const handleSearch = (event) => {
      console.log('Event:', event);
      if (!event || !event.target || typeof event.target.value !== 'string') {
        console.error('Digite un servicio');
        return;
      }
    
      const term = event.target.value.toLowerCase();
      console.log('Search Term:', term);


    
      if (!Array.isArray(filteredServices)) {
        console.error('No hay servicios en el arreglo');
        return;
      }
    
      const filtered = filteredServices.filter(service => {
        if (!service || !service.nombreServicio || typeof service.nombreServicio !== 'string') {
          console.error('Invalido', service);
          return false;
        }
        return service.nombreServicio.toLowerCase().includes(term);
      });
    
      console.log('Filtered Services:', filtered);
      setFilteredServices(filtered);
    };
    
  

  /*const handleClick = (serviceName) => {
    alert(`You clicked on ${serviceName}`);
  };*/

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsSidebarOpen(open);
  };


  const [especialista, setEspecialista] = useState(1);

   
  useEffect(() => {
    if (decodedToken) {
      setEspecialista(decodedToken.data.especialista);
    }
  }, [decodedToken]);
 


  return (
    <>
      <SidebarEspecialista isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />
      <div className="content" style={{ maxWidth: '700px', margin: '9rem auto' }}>
        {especialista == '1' ? (
          <>
            <h3 className='color-primary text-center'><b>Empieza a ver las ofertas que hay para ti</b></h3>
            <div className="row justify-content-center mb-4">
              <div className="col-md-6">
                <input
                  type="text"
                  placeholder="¿Qué estás buscando?"
                  onChange={handleSearch}
                  className="form-control"
                />
              </div>
            </div>
            <div className="card-container" >
              {filteredServices.map(services => (
                <div key={services.name} className="card" onClick={() => handleClick(services.name)} style={{marginTop:"1rem"}}>
                  <a href={'/visualizacion-ofertas/'+services.idSolicitud}>
                  <div className="card-header">
                    <h5 className="card-title">{services.nombreServicio}</h5>
                    <p className="card-price">S/. {services.precio}</p>
                    <p className="card-body">{services.descripcion}</p>
                    <p className="card-footer">{services.ubicacion}</p>
                    <p className="card-footer">{services.fechaHoraSolicitud}</p>
                  </div>
                  </a>
                </div>
              ))}
            </div>
           </>
          ) : (
            <>
              <h3 className='color-primary text-center'><b>Registrate como especialista para poder ver las solicitudes</b></h3>
              <img src="/buscar.png" width="100%"/>
            </>
          )}
      </div>
    </>
  );
}
