"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/sidebar";
import "../estilos/globales.css";
import "./activacion-de-alarma-module.css";

const ActivacionAlarma = () => {
  const [users, setUsers] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [groupUsers, setGroupUsers] = useState([]);
  const [alarmReason, setAlarmReason] = useState('');
  const [isGroupAlarmActive, setIsGroupAlarmActive] = useState(false);
  const [alarmReasons, setAlarmReasons] = useState([]);

  useEffect(() => {
    if (selectedDistrict) {
      const mockUsers = {
        "Cercado": [{ name: 'Pedro Paredes' }, { name: 'Ana Flores' }],
        "Yanahuara": [{ name: 'Luis Arce' }, { name: 'Sofia Castillo' }],
        "Miraflores": [{ name: 'Carlos Pérez' }, { name: 'Maria Garcia' }],
        "Paucarpata": [{ name: 'Elena Fernandez' }, { name: 'Jose Huamani' }],
        "Mariano Melgar": [{ name: 'Luis Lopez' }, { name: 'Rosa Alvarez' }]
      };
      setUsers(mockUsers[selectedDistrict] || []);
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleAddUser = (user) => {
    if (!groupUsers.some(u => u.name === user.name)) {
      setGroupUsers([...groupUsers, { ...user, alarmActive: false }]);
    }
  };

  const toggleAlarm = (user) => {
    const updatedUsers = groupUsers.map(u => 
      u.name === user.name ? { ...u, alarmActive: !u.alarmActive } : u
    );
    setGroupUsers(updatedUsers);
    if (!user.alarmActive && alarmReason.trim) {
      setAlarmReasons([...alarmReasons, { user: user.name, reason: alarmReason }]);
    }
  };

  const handleGroupAlarmToggle = () => {
    setShowDialog(true);
  };

  const confirmAlarmActivation = () => {
    if (!alarmReason.trim()) {
      alert('Por favor ingrese un motivo para activar la alarma');
      return;
    }
    
    const userName = 'Pepe Ruiz Paz'; // Asegúrate de asignar el usuario que está activando la alarma
    setAlarmReasons([...alarmReasons, { user: userName, reason: alarmReason }]);
    setIsGroupAlarmActive(!isGroupAlarmActive);
    setShowDialog(false);
    setAlarmReason('');
  };

  return (
    <div className="container-fluid activacion-alarma" style={{ marginTop: '60px' }}>
      <Sidebar />
      <ToastContainer />
      
      <div className="header d-flex justify-content-between align-items-center mt-3">
        <h1>Grupo de Vecinos</h1>
      </div>
      
      <div className="search-section mt-3">
        <input type="text" placeholder="Buscar Usuario por nombre" className="form-control d-inline-block" style={{ width: '300px' }} />
        <span className="mx-2"><i className="fas fa-search"></i></span>
        <select className="form-select d-inline-block" style={{ width: '200px' }} onChange={handleDistrictChange}>
          <option value="">Distrito</option>
          <option value="Cercado">Cercado</option>
          <option value="Yanahuara">Yanahuara</option>
          <option value="Cayma">Cayma</option>
          <option value="Sachaca">Sachaca</option>
          <option value="Paucarpata">Paucarpata</option>
        </select>
        <Button 
          onClick={() => handleAddUser(users[0])} 
          style={{ backgroundColor: 'rgba(255,193,7,255)', color: '#000', border: 'none', marginLeft: '10px' }}
        >
          Agregar
        </Button>
      </div>

      <div className="users-list mt-4">
        {groupUsers.map((user, index) => (
          <div key={index} className="user-item d-flex align-items-center justify-content-between mb-2" style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <span className="me-2" style={{ flex: 1 }}>{user.name}</span>
            <Button
              className="btn btn-info"
              style={{ background: 'rgb(164,203,180)', border: '0px', display: 'flex', alignItems: 'center' }}
              onClick={() => toggleAlarm(user)}
            >
              <img src="/icons/alert.png" alt="Alerta" style={{ width: '20px', height: '21px' }} />
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={() => setGroupUsers(groupUsers.filter(u => u.name !== user.name))}
              className="ms-2"
            >
              🗑️
            </Button>
          </div>
        ))}
      </div>

      <div className="alarm-reasons mt-4">
        <h2>Motivo de Alarma</h2>
        {alarmReasons.map((reason, index) => (
          <p key={index}><strong>{reason.user}:</strong> {reason.reason}</p>
        ))}
      </div>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>¿Esta seguro que desea activar la alarma de emergencia? En ese caso escribe un motivo por el cual desea activar para informar a los demás integrantes del grupo.</DialogTitle>
        <DialogContent>
          <textarea 
            placeholder="Escriba el motivo para activar la alarma"
            onChange={(e) => setAlarmReason(e.target.value)}
            value={alarmReason}
            className="form-control"
          ></textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="secondary">
            No, Ignorar
          </Button>
          <Button onClick={confirmAlarmActivation} color="primary">
            Sí, Activar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ActivacionAlarma;