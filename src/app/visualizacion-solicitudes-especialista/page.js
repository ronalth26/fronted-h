'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebarEspecialista.js';
import './visualizacion-solicitudes-especialista.css';
import { DOMAIN_BACK,DOMAIN_FRONT } from '../../../env.js';


import useToken  from '../utils/auth';
import { useJwt } from "react-jwt";

const Page = () => {

  
  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filteredServicios, setFilteredServicios] = useState([]);

  

       // TRAER LAS SOLICITUDES

       const [id_usuario, setIdUsuario] = useState(0);
       const [especialista, setEspecialista] = useState(0);
 
       useEffect(() => {
        if (decodedToken) {
          setIdUsuario(decodedToken.data.id);
          setEspecialista(decodedToken.data.especialista);
        }
      }, [decodedToken]);
     
     
     useEffect(() => {
      // Fetch categories from the backend
      if(id_usuario != 0){
      fetch(DOMAIN_BACK+'?controller=solicitudes&action=traer_solicitudes&idEspecialista='+id_usuario)
        .then(response => response.json())
        .then(data => {
          setFilteredServicios(data)
        })
        .catch(error => console.error('Error al traer solicitud:', error));
      }
    }, [id_usuario]);



    console.log(filteredServicios);




  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterServices(term, filterDate);
  };

  const handleDateFilter = (event) => {
    const date = event.target.value;
    setFilterDate(date);
    filterServices(searchTerm, date);
  };

  const filterServices = (term, date) => {
    const filtered = filteredServicios.filter(service =>
      service.nombreServicio.toLowerCase().includes(term) &&
      service.fechaHoraSolicitud.includes(date)
    );
    setFilteredServicios(filtered);
  };

  return (
    <>
      <Sidebar />
      <div className="content">
        <h3 className="text-center">Historial de Servicios</h3>
        <div className="filters">
          <input
            type="text"
            placeholder="Buscar servicio..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
          />
          <input
            type="date"
            value={filterDate}
            onChange={handleDateFilter}
            className="form-control"
          />
        </div>
        <div className="historial-list">
        
          {filteredServicios.map((servicio, index) => (
            <a href={'/visualizacion-solicitud-proceso-especialista/'+servicio.idSolicitud}>
            <div key={index} className="historial-item mt-2 p-4">
              <h4>{servicio.nombreServicio}</h4>
              <p>Nombre de cliente: {servicio.nombre} {servicio.apellido}</p>
              <p>Descripción: {servicio.descripcion}</p>
              <p>Dirección: {servicio.ubicacion}</p>
              <p>Fecha: {servicio.fechaHoraSolicitud}</p>
              {servicio.estado == 1 && (
                   <p className="card-footer alert alert-primary">EN NEGOCIACIÓN</p>
                )}
                
                {servicio.estado == 2 && (
                   <p className="card-footer alert alert-success">EN PROCESO</p>
                )}

                {servicio.estado == 3 && (
                   <p className="card-footer alert alert-secondary">TERMINADA</p>
                )}
                {servicio.estado == 4 && (
                   <p className="card-footer alert alert-darger">CANCELADA</p>
                )}
         
            </div>
            </a>
          ))}
         
        </div>
      </div>
    </>
  );
};

export default Page;
