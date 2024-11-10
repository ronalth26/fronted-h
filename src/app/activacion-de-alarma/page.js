"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/sidebar";
import "../estilos/globales.css";
import "./activacion-de-alarma-module.css";

const ActivacionAlarma = () => {
  const [users, setUsers] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [groupUsers, setGroupUsers] = useState([]);
  const [alarmReason, setAlarmReason] = useState("");
  const [isGroupAlarmActive, setIsGroupAlarmActive] = useState(false);
  const [alarmReasons, setAlarmReasons] = useState([]);

  // Fetch users based on district (mock data)
  const districtUsers = {
    Cercado: [
      { id: 1, name: "Juan Pérez" },
      { id: 2, name: "Carlos López" },
      { id: 3, name: "Ana Sánchez" },
      { id: 4, name: "Luis García" },
      { id: 5, name: "María Rodríguez" },
    ],
    Yanahuara: [
      { id: 6, name: "Pedro Martínez" },
      { id: 7, name: "Laura Ruiz" },
      { id: 8, name: "Ricardo Torres" },
      { id: 9, name: "Sofía Ramírez" },
      { id: 10, name: "Fernando Díaz" },
    ],
    Cayma: [
      { id: 11, name: "Marta Herrera" },
      { id: 12, name: "Raúl Fernández" },
      { id: 13, name: "Pablo Castro" },
      { id: 14, name: "Elena Pérez" },
      { id: 15, name: "Carlos Jiménez" },
    ],
    Arequipa: [
      { id: 16, name: "Verónica Gómez" },
      { id: 17, name: "Javier Morales" },
      { id: 18, name: "Adriana Méndez" },
      { id: 19, name: "Juan Ramírez" },
      { id: 20, name: "Eva Martínez" },
    ],
    "José Luis Bustamante": [
      { id: 21, name: "Oscar Díaz" },
      { id: 22, name: "Ricardo Pérez" },
      { id: 23, name: "Claudia Silva" },
      { id: 24, name: "Miguel Rodríguez" },
      { id: 25, name: "Patricia Torres" },
    ],
  };

  // Update users when district changes
  useEffect(() => {
    if (selectedDistrict) {
      setUsers(districtUsers[selectedDistrict] || []);
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleAddUser = (user) => {
    if (!groupUsers.some((u) => u.id === user.id)) {
      setGroupUsers([...groupUsers, { ...user, alarmActive: false }]);
    }
  };

  const toggleAlarm = (user) => {
    const updatedUsers = groupUsers.map((u) =>
      u.id === user.id ? { ...u, alarmActive: !u.alarmActive } : u
    );
    setGroupUsers(updatedUsers);
    if (!user.alarmActive && alarmReason.trim()) {
      setAlarmReasons([
        ...alarmReasons,
        { user: user.name, reason: alarmReason },
      ]);
    }
  };

  const handleGroupAlarmToggle = () => {
    setShowDialog(true);
  };

  const confirmAlarmActivation = () => {
    if (!alarmReason.trim()) {
      alert("Por favor ingrese un motivo para activar la alarma");
      return;
    }
    setIsGroupAlarmActive(!isGroupAlarmActive);
    setShowDialog(false);
  };

  return (
    <div className="container-fluid activacion-alarma">
      <Sidebar />
      <ToastContainer />
      <div className="header d-flex justify-content-between align-items-center">
        <h1>Grupo de Vecinos</h1>
        <Button
          variant="contained"
          color={isGroupAlarmActive ? "danger" : "success"}
          onClick={handleGroupAlarmToggle}
          style={{ backgroundColor: isGroupAlarmActive ? "red" : "green" }}
        >
          {isGroupAlarmActive ? "Alarma Activada" : "Alarma Desactivada"}
        </Button>
      </div>
      <div className="search-section mb-4">
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar Usuario por nombre"
          />
          <FaSearch
            className="search-icon"
            style={{ position: "absolute", right: "20px", top: "10px" }}
          />
          <select
            className="form-control"
            onChange={handleDistrictChange}
            style={{ marginLeft: "10px" }}
          >
            <option value="">Seleccione Distrito</option>
            {Object.keys(districtUsers).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <Button
          onClick={() => handleAddUser(users[0])}
          className="mt-2"
          style={{ backgroundColor: "rgba(255,193,7,1)", color: "black" }}
        >
          Agregar
        </Button>
      </div>

      <div className="users-list mb-4">
        {groupUsers.map((user, index) => (
          <div
            key={index}
            className="user-item d-flex justify-content-between align-items-center mb-2"
          >
            <span>{user.name}</span>
            <div>
              <Button
                variant="outline-secondary"
                onClick={() => toggleAlarm(user)}
                style={{
                  backgroundColor: user.alarmActive ? "red" : "green",
                  color: "white",
                }}
              >
                {user.alarmActive ? "Desactivar" : "Activar"}
              </Button>
              <Button
                variant="outline-danger"
                onClick={() =>
                  setGroupUsers(groupUsers.filter((u) => u.id !== user.id))
                }
                className="ml-2"
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="alarm-reasons mb-4">
        <h2>Motivo de Alarma</h2>
        {alarmReasons.map((reason, index) => (
          <p key={index}>
            <strong>{reason.user}:</strong> {reason.reason}
          </p>
        ))}
      </div>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>
          ¿Está seguro que desea activar la alarma de emergencia?
        </DialogTitle>
        <DialogContent>
          <textarea
            placeholder="Ingrese el motivo de la alarma"
            onChange={(e) => setAlarmReason(e.target.value)}
            className="form-control"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>No, Ignorar</Button>
          <Button onClick={confirmAlarmActivation}>Sí, Activar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ActivacionAlarma;
