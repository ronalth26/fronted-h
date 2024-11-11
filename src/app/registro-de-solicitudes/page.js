'use client';

import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSession } from 'next-auth/react';
import { useJwt } from "react-jwt";
import useToken  from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';






const MapComponent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [editInfo, setEditInfo] = useState({ phone: '', message: '' });

  const handleEditClick = (phone, message) => {
    setEditInfo({ phone, message });
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  
  const { data: session } = useSession(); // Obtener la sesión de next-auth
  const mapRef = useRef(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [locationInfo, setLocationInfo] = useState({ user: 'Usuario no logueado', zoneType: '', color: '', address: '' });
  const mapInstance = useRef(null);
  const [isCentered, setIsCentered] = useState(false);
  const [addressCaptured, setAddressCaptured] = useState(false); // Para capturar la ubicación solo una vez
  //usuario
  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);
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

  const dangerousZoneCoords = [
    [[-16.41057, -71.53707], [-16.41011, -71.53749], [-16.40922, -71.53866], [-16.40887, -71.53837],
    [-16.40816, -71.53925], [-16.40963, -71.54049], [-16.4103, -71.54016], [-16.41075, -71.53944],
    [-16.41127, -71.54004], [-16.41175, -71.53973], [-16.41192, -71.53984], [-16.41311, -71.53922],
    [-16.41196, -71.53899]
    ],
    // Nueva zona peligrosa
    [
      [-16.37595, -71.51804],
      [-16.37603, -71.51815],
      [-16.37627, -71.51775]
    ],
    [
      [-16.37885, -71.52044],
      [-16.3807, -71.51929],
      [-16.3796, -71.51744],
      [-16.37949, -71.51752],
      [-16.38054, -71.51925],
      [-16.37876, -71.52038]
      
    ],
    [
      [-16.37954, -71.51871],
      [-16.38224, -71.51695],
      [-16.38166, -71.51615],
      [-16.38178, -71.51605],
      [-16.3831, -71.51782],
      [-16.3829, -71.51789],
      [-16.38232, -71.51705],
      [-16.37949, -71.51883]
      
    ],
    [
      [-16.37301, -71.51988],
      [-16.37326, -71.51968],
      [-16.37338, -71.51991],
      [-16.37316, -71.52016]      
    ],
    [
      [-16.3801, -71.52094],
      [-16.38082, -71.52061],
      [-16.38062, -71.5204]
      ],[
      [-16.38427, -71.51734],
      [-16.38394, -71.51703],
      [-16.38407, -71.5168]
      ],[
      [-16.37996, -71.51567],
      [-16.38015, -71.51598],
      [-16.38028, -71.51588]
      ],[
      [-16.38018, -71.51725],
      [-16.38036, -71.51743],
      [-16.38022, -71.51718]
      ],[
      [-16.38458, -71.5201],
      [-16.38554, -71.52029],
      [-16.38501, -71.52069]
      ],[
      [-16.38363, -71.52156],
      [-16.38404, -71.52045],
      [-16.38448, -71.52106]
      ],[
      [-16.38152, -71.52287],
      [-16.38137, -71.52265],
      [-16.3813, -71.52293]
      ],[
      [-16.37509, -71.52352],
      [-16.37545, -71.52335],
      [-16.37562, -71.52388]
      ],[
      [-16.37863, -71.52769],
      [-16.37867, -71.52747],
      [-16.37877, -71.52759]
      ],[
      [-16.38184, -71.52591],
      [-16.38211, -71.52567],
      [-16.38188, -71.52597]
      ],[
      [-16.37299, -71.5155],
      [-16.37287, -71.51535],
      [-16.37366, -71.51504]
      ],[
      [-16.37496, -71.51404],
      [-16.37511, -71.51394],
      [-16.37502, -71.51384]
      ],[
      [-16.37593, -71.51388],
      [-16.37603, -71.51396],
      [-16.3761, -71.51377]
      ],[
      [-16.37519, -71.51252],
      [-16.37533, -71.5127],
      [-16.37543, -71.51265]
      ],[
      [-16.37705, -71.51319],
      [-16.37814, -71.51516],
      [-16.37824, -71.51509]
      ],[
      [-16.4122, -71.54538],
      [-16.41235, -71.54517],
      [-16.41209, -71.54495]
      ],[
      [-16.41145, -71.5448],
      [-16.41117, -71.54455],
      [-16.41158, -71.54455]
      ],[
      [-16.41018, -71.54376],
      [-16.40993, -71.54353],
      [-16.41032, -71.54357]
      ],[
      [-16.41072, -71.54758],
      [-16.41051, -71.54741],
      [-16.41079, -71.54743]
      ],[
      [-16.41002, -71.54586],
      [-16.41012, -71.54582],
      [-16.41002, -71.54572]
      ],[
      [-16.40836, -71.54584],
      [-16.40788, -71.54536],
      [-16.40824, -71.54543]
      ],[
      [-16.40895, -71.54482],
      [-16.4089, -71.54463],
      [-16.40877, -71.54474]
      ],[
      [-16.40846, -71.54396],
      [-16.40852, -71.54387],
      [-16.40855, -71.54396]
      ],[
      [-16.40678, -71.54351],
      [-16.40659, -71.54359],
      [-16.40657, -71.54345]
      ],[
      [-16.40752, -71.54198],
      [-16.40736, -71.54201],
      [-16.40732, -71.54183]
      ],[
      [-16.40646, -71.54198],
      [-16.40676, -71.54193],
      [-16.40659, -71.54185]
      ],[
      [-16.40485, -71.54388],
      [-16.4049, -71.54401],
      [-16.405, -71.54385]
      ],[
      [-16.40534, -71.5421],
      [-16.40551, -71.54157],
      [-16.40507, -71.54134]
      ],[
      [-16.40421, -71.54231],
      [-16.40408, -71.54228],
      [-16.4041, -71.54217]
      ],[
      [-16.40338, -71.54307],
      [-16.40321, -71.5431],
      [-16.40325, -71.54294]
      ],[
      [-16.40272, -71.54206],
      [-16.40298, -71.54207],
      [-16.40292, -71.54218]
      ],[
      [-16.40309, -71.54116],
      [-16.40388, -71.54056],
      [-16.40335, -71.54039]
      ],[
      [-16.40631, -71.53959],
      [-16.40706, -71.53959],
      [-16.40684, -71.53922]
      ],[
      [-16.40833, -71.53758],
      [-16.40867, -71.53801],
      [-16.4079, -71.53896]
      ],[
      [-16.40745, -71.53566],
      [-16.40755, -71.53514],
      [-16.40777, -71.53598]
      ],[
      [-16.40628, -71.53508],
      [-16.40641, -71.53498],
      [-16.40597, -71.53454]
      ],[
      [-16.40219, -71.53871],
      [-16.4037, -71.53457],
      [-16.40384, -71.5346],
      [-16.40231, -71.53877]
      ],[
      [-16.40395, -71.53943],
      [-16.40409, -71.5394],
      [-16.40407, -71.53924]
      ],[
      [-16.40437, -71.53864],
      [-16.40448, -71.53843],
      [-16.40463, -71.53854]
      ],[
      [-16.40582, -71.53792],
      [-16.40545, -71.53788],
      [-16.40549, -71.53776]
      ],[
      [-16.4011, -71.53958],
      [-16.40045, -71.54057],
      [-16.39967, -71.53913]
      ],[
      [-16.40494, -71.53765],
      [-16.39467, -71.53347],
      [-16.39537, -71.53125],
      [-16.39646, -71.53161],
      [-16.39732, -71.52925],
      [-16.39804, -71.53028],
      [-16.39982, -71.52882],
      [-16.40253, -71.53178],
      [-16.40447, -71.53288],
      [-16.40381, -71.53458],
      [-16.40577, -71.53553]
      ],[//mi casa
        [-16.37327, -71.51523], 
        [-16.37678, -71.51941], 
        [-16.37753, -71.51882], 
        [-16.3741, -71.51461]
        ],    
  ];

  const safeZoneCoords = [
    
  // Nueva zona segura
    [[-16.37869, -71.52059],
    [-16.38071, -71.51932],
    [-16.38009, -71.5184],
    [-16.37781, -71.51977]
    ],
    [
      [-16.37318, -71.52029],
      [-16.37662, -71.52613],
      [-16.37825, -71.52807],
      [-16.3812, -71.52473],
      [-16.37908, -71.52262],
      [-16.37946, -71.52194],
      [-16.37566, -71.51823],
      [-16.37381, -71.51921],
      [-16.37403, -71.51959]        
    ],
    [
      [-16.40938, -71.54037],
      [-16.40811, -71.53928],
      [-16.40822, -71.5391],
      [-16.40771, -71.53872],
      [-16.408, -71.53841],
      [-16.40832, -71.53829],
      [-16.40859, -71.53801],
      [-16.40845, -71.53791],
      [-16.40821, -71.53817],
      [-16.40745, -71.53856],
      [-16.40665, -71.53928],
      [-16.40569, -71.53993],
      [-16.40545, -71.54019],
      [-16.4057, -71.54024],
      [-16.40847, -71.54237],
      [-16.40907, -71.54148],
      [-16.40889, -71.54112]
      ],
      [
        [-16.40975, -71.54423],
        [-16.4087, -71.5434],
        [-16.40786, -71.54231],
        [-16.40694, -71.54194],
        [-16.40662, -71.54184],
        [-16.40574, -71.54214],
        [-16.40306, -71.54101],
        [-16.40217, -71.54295],
        [-16.40304, -71.54304],
        [-16.40399, -71.54359],
        [-16.40486, -71.54461],
        [-16.4053, -71.54508],
        [-16.40794, -71.54542],
        [-16.40906, -71.5466]
        ]             
];


const getAddressFromCoords = (latitude, longitude) => {
  const apiKey = 'AIzaSyA4Ek5gJPbNrIXnDOpEBKs6-HrmQ-fQTLg'; 
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        return data.results[0]?.formatted_address || "Dirección no disponible";
      } else {
        console.error("Error al obtener la dirección:", data.status);
        return "Error al obtener la dirección";
      }
    })
    .catch(err => {
      console.error("Error al obtener la dirección:", err);
      return "Error al obtener la dirección";
    });
};


  useEffect(() => {
    // Verificar que el contenedor del mapa esté disponible
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        center: [-16.4095, -71.537],
        zoom: 14,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      // Agregar las zonas peligrosas y seguras
      const dangerousZone = L.polygon(dangerousZoneCoords, { color: 'red' }).addTo(mapInstance.current);
      const safeZone = L.polygon(safeZoneCoords, { color: 'green' }).addTo(mapInstance.current);

      mapInstance.current.dangerousZone = dangerousZone;
      mapInstance.current.safeZone = safeZone;
    }
  }, []);

  useEffect(() => {
    // Asegurarse de que la geolocalización esté habilitada y la ubicación solo se capture una vez
    if (navigator.geolocation && !addressCaptured) {  // Solo obtener ubicación si aún no se ha capturado la dirección
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log('Ubicación obtenida:', latitude, longitude);

        const latLng = L.latLng(latitude, longitude);

        // Centrar el mapa solo una vez
        if (!isCentered) {
          mapInstance.current.setView(latLng, 24);
          setIsCentered(true);
        }

        // Eliminar marcador anterior si existe
        if (currentLocationMarker) {
          mapInstance.current.removeLayer(currentLocationMarker);
        }

        // Crear un marcador para la ubicación actual
        const newLocationMarker = L.circle(latLng, {
          color: 'blue',
          fillColor: '#30f',
          fillOpacity: 0.7,
          radius: 10
        }).addTo(mapInstance.current);
        setCurrentLocationMarker(newLocationMarker);

        let zoneType = 'normal';
        let color = '';

        // Verificar primero si está en alguna de las zonas seguras
        for (let i = 0; i < safeZoneCoords.length; i++) {
          const safeZone = L.polygon(safeZoneCoords[i]);
          if (safeZone.getBounds().contains(latLng)) {
            zoneType = 'segura';
            color = 'green';
            break;
          }
        }

        // Solo si no está en una zona segura, verificar si está en una zona peligrosa
        if (zoneType === 'normal') {
          for (let i = 0; i < dangerousZoneCoords.length; i++) {
            const dangerZone = L.polygon(dangerousZoneCoords[i]);
            if (dangerZone.getBounds().contains(latLng)) {
              zoneType = 'peligrosa';
              color = 'red';
              break;
            }
          }
        }

        // Capturar la dirección solo una vez
        if (!addressCaptured) {
          getAddressFromCoords(latitude, longitude)
            .then(address => {
              setLocationInfo({
                user: session?.user?.name || "Usuario no logueado", // Si no hay sesión, mostrar 'Usuario no logueado'
                zoneType: zoneType.charAt(0).toUpperCase() + zoneType.slice(1),
                color,
                address: address
              });
              setAddressCaptured(true);  // Marcar que la dirección ha sido capturada
            })
            
            .catch(error => {
              console.error("Error al obtener la dirección:", error);
              setLocationInfo({
                user: session?.user?.name || "Usuario no logueado",
                zoneType: zoneType.charAt(0).toUpperCase() + zoneType.slice(1),
                color,
                address: "Error al obtener la dirección."
              });
              setAddressCaptured(true);  // Marcar que la dirección ha sido capturada
            });
        }
      }, (error) => {
        console.error("Error al obtener la ubicación:", error);
        setLocationInfo({ user: session?.user?.name || "Usuario no logueado", zoneType: "Desconocida", color: '', address: "No se pudo obtener la ubicación." });
      });
    } else {
      setLocationInfo({ user: session?.user?.name || "Usuario no logueado", zoneType: "Desconocida", color: '', address: "La geolocalización no está soportada en este navegador." });
    }
  }, [session, currentLocationMarker, isCentered, addressCaptured]);  // La dependencia 'addressCaptured' asegura que se ejecute solo una vez

  return (
    <div>
    <div ref={mapRef} style={{ height: "500px", width: "100%" }}></div>

        <div style={{
  display: 'flex',
  justifyContent: 'center',
  marginTop: '20px',
  marginLeft: '20px',
  padding: '10px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  width: '90%',
  overflow: 'auto'
}}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid #ccc', padding: '10px' }}>Usuario</th>
      <th style={{ border: '1px solid #ccc', padding: '10px' }}>Zona</th>
      <th style={{ border: '1px solid #ccc', padding: '10px' }}>Color</th>
      <th style={{ border: '1px solid #ccc', padding: '10px' }}>Dirección</th>
      <th style={{ border: '1px solid #ccc', padding: '10px' }}>Llamar</th>
      <th style={{ border: '1px solid #ccc', padding: '10px' }}>Mensaje</th>
      <th style={{ border: '1px solid #ccc', padding: '10px' }}>Acción</th>
    </tr>
  </thead>
  <tbody>
    {/* Primer registro con popup con checks */}
    <tr>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{nombre} {apellido}</td>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{locationInfo.zoneType}</td>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}><span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: locationInfo.color }}></span></td>
    
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>{locationInfo.address}</td>

      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
        <button style={{
          padding: '5px 10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>976391306</button>
      </td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
        <img
          src="https://img.icons8.com/material-rounded/24/000000/sms.png"
          alt="Mensaje"
          style={{ width: '40px', height: '40px' }}
        />
        <a
          href="https://wa.me/51976391306?text=Ten%20cuidado,%20me%20llamas%20cuando%20llegues%20a%20casa"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '10px' }}
        >
          <img
            src="https://img.icons8.com/material-rounded/24/25D366/whatsapp.png"
            alt="WhatsApp"
            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          />
        </a>
      </td>
      <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
        <button
          data-bs-toggle="modal" data-bs-target="#editPopup1"
          style={{
            backgroundColor: '#eee',
            border: '2px solid #ccc',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
      </td>
    </tr>

    {/* Otros registros con popup sin checks */}
    <tr>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>Valery Pampa Gonzales</td>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>Segura</td>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}><span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: 'green' }}></span></td>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>Av. Peru 405, Arequipa 04001, Perú</td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
        <button style={{
          padding: '5px 10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>967326481</button>
      </td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
        <img
          src="https://img.icons8.com/material-rounded/24/000000/sms.png"
          alt="Mensaje"
          style={{ width: '40px', height: '40px' }}
        />
        <a
          href="https://wa.me/51976391306?text=Ten%20cuidado,%20me%20llamas%20cuando%20llegues%20a%20casa"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '10px' }}
        >
          <img
            src="https://img.icons8.com/material-rounded/24/25D366/whatsapp.png"
            alt="WhatsApp"
            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          />
        </a>
      </td>
      <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
        <button
          data-bs-toggle="modal" data-bs-target="#editPopup2"
          style={{
            backgroundColor: '#eee',
            border: '2px solid #ccc',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
      </td>
    </tr><tr>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>Liz Canchari Maman</td>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>Segura</td>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}><span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: 'green' }}></span></td>
    <td style={{ border: '1px solid #ccc', padding: '10px' }}>Av. Peru 405, Arequipa 04001, Perú</td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
        <button style={{
          padding: '5px 10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>956731657</button>
      </td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
        <img
          src="https://img.icons8.com/material-rounded/24/000000/sms.png"
          alt="Mensaje"
          style={{ width: '40px', height: '40px' }}
        />
        <a
          href="https://wa.me/51976391306?text=Ten%20cuidado,%20me%20llamas%20cuando%20llegues%20a%20casa"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '10px' }}
        >
          <img
            src="https://img.icons8.com/material-rounded/24/25D366/whatsapp.png"
            alt="WhatsApp"
            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          />
        </a>
      </td>
      <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
        <button
          data-bs-toggle="modal" data-bs-target="#editPopup2"
          style={{
            backgroundColor: '#eee',
            border: '2px solid #ccc',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
      </td>
    </tr>

    <tr>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>Sharon Villavicencio Siu</td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>Peligrosa</td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}><span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: 'red' }}></span></td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>Av. Arequipa 1031-1023, Perú</td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
        <button style={{
          padding: '5px 10px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>976577328</button>
      </td>
      <td style={{ border: '1px solid #ccc', padding: '10px' }}>
        <img
          src="https://img.icons8.com/material-rounded/24/000000/sms.png"
          alt="Mensaje"
          style={{ width: '40px', height: '40px' }}
        />
        <a
          href="https://wa.me/51976391306?text=Ten%20cuidado,%20me%20llamas%20cuando%20llegues%20a%20casa"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '10px' }}
        >
          <img
            src="https://img.icons8.com/material-rounded/24/25D366/whatsapp.png"
            alt="WhatsApp"
            style={{ width: '40px', height: '40px', cursor: 'pointer' }}
          />
        </a>
      </td>
      <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
        <button
          data-bs-toggle="modal" data-bs-target="#editPopup2"
          style={{
            backgroundColor: '#eee',
            border: '2px solid #ccc',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
      </td>
    </tr>
  </tbody>
</table>

{/* Pop-up de edición para el primer registro (con checks) */}
<div className="modal fade" id="editPopup1" tabIndex="-1" aria-labelledby="editPopup1Label" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="editPopup1Label">Editar Información</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <label>Teléfono:</label>
        <input
          type="text"
          value={editInfo.phone}
          onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })}
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        />
        <label>Mensaje:</label>
        <input
          type="text"
          value={editInfo.message}
          onChange={(e) => setEditInfo({ ...editInfo, message: e.target.value })}
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        />
        {/* Checkboxes solo en el primer registro */}
        <div>
          <label>
            <input type="checkbox" checked={true} /> REAL
          </label>
          <label>
            <input type="checkbox" /> DISTRITO
          </label>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" className="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>

{/* Pop-up de edición para los otros registros (sin checks) */}
<div className="modal fade" id="editPopup2" tabIndex="-1" aria-labelledby="editPopup2Label" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="editPopup2Label">Editar Información</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <label>Teléfono:</label>
        <input
          type="text"
          value={editInfo.phone}
          onChange={(e) => setEditInfo({ ...editInfo, phone: e.target.value })}
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        />
        <label>Mensaje:</label>
        <input
          type="text"
          value={editInfo.message}
          onChange={(e) => setEditInfo({ ...editInfo, message: e.target.value })}
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" className="btn btn-primary">Guardar</button>
      </div>
    </div>
  </div>
</div>
</div>
</div>
    );
  };

export default MapComponent;