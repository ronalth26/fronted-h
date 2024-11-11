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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const ActivacionAlarma = () => {
  const [users, setUsers] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [groupUsers, setGroupUsers] = useState([]);
  const [alarmReason, setAlarmReason] = useState("");
  const [alarmReasons, setAlarmReasons] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (selectedDistrict) {
      const mockUsers = {
        Cercado: [{ name: "Pedro Paredes" }, { name: "Ana Flores" }],
        Yanahuara: [{ name: "Luis Arce" }, { name: "Sofia Castillo" }],
        Miraflores: [{ name: "Carlos Pérez" }, { name: "Maria Garcia" }],
        Paucarpata: [{ name: "Elena Fernandez" }, { name: "Jose Huamani" }],
        Socabaya: [{ name: "Luis Lopez" }, { name: "Rosa Alvarez" }],
      };
      setUsers(mockUsers[selectedDistrict] || []);
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const handleAddUser = (user) => {
    if (!groupUsers.some((u) => u.name === user.name)) {
      setGroupUsers([...groupUsers, { ...user, alarmActive: false }]);
    }
  };

  const toggleAlarmDialog = (user) => {
    setSelectedUser(user);
    setShowDialog(true);
  };

  const handleAlarmReasonChange = (e) => {
    setAlarmReason(e.target.value);
  };

  const handleConfirmAlarm = () => {
    if (alarmReason.trim()) {
      const updatedUsers = groupUsers.map((u) =>
        u.name === selectedUser.name ? { ...u, alarmActive: true } : u
      );
      setGroupUsers(updatedUsers);

      setAlarmReasons([
        ...alarmReasons,
        { user: selectedUser.name, reason: alarmReason },
      ]);

      setAlarmReason("");
      setShowDialog(false);
    } else {
      alert("Por favor ingrese un motivo para activar la alarma");
    }
  };

  const buttonColor = (alarmActive) =>
    alarmActive ? "rgb(232, 92, 92)" : "rgb(164,203,180)";

  return (
    <>
      <Sidebar />
      <ToastContainer />

      <section className="chat-section" style={{ marginTop: "5rem" }}>
        <div className="container" style={{ backgroundColor: "white" }}>
          <div className="row justify-content-center">

            <div className="col-md-6 text-center mb-5">
              <h1>
                <FontAwesomeIcon icon={faUsers} style={{ marginRight: "10px" }} />
                Grupo de Vecinos
              </h1>
            </div>

          </div>


          <div className="search-section mt-3">
            <input
              type="text"
              placeholder="Buscar Usuario por nombre"
              className="form-control d-inline-block"
              style={{ width: "300px" }}
            />
            <span className="mx-2">
              <i className="fas fa-search"></i>
            </span>
            <select
              className="form-select d-inline-block"
              style={{ width: "200px" }}
              onChange={handleDistrictChange}
            >
              <option value="">Distrito</option>
              <option value="Cercado">Cercado</option>
              <option value="Yanahuara">Yanahuara</option>
              <option value="Miraflores">Miraflores</option>
              <option value="Paucarpata">Paucarpata</option>
              <option value="Socabaya">Socabaya</option>
            </select>
            <Button
              onClick={() => handleAddUser(users[0])}
              style={{
                backgroundColor: "rgba(255,193,7,255)",
                color: "#000",
                border: "none",
                marginLeft: "10px",
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: "10px" }} />
              Agregar
            </Button>


          </div>

          <div className="users-list mt-4">
            {groupUsers.map((user, index) => (
              <div
                key={index}
                className="user-item d-flex align-items-center justify-content-between mb-2"
                style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
              >
                <span className="me-2" style={{ flex: 1 }}>
                  {user.name}
                </span>
                <Button
                  className="btn btn-info"
                  style={{
                    background: buttonColor(user.alarmActive),
                    border: "0px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => toggleAlarmDialog(user)}
                >
                  <img
                    src="/icons/alert.png"
                    alt="Alerta"
                    style={{ width: "20px", height: "21px" }}
                  />
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() =>
                    setGroupUsers(groupUsers.filter((u) => u.name !== user.name))
                  }
                  className="ms-2"
                >
                  🗑️
                </Button>
              </div>
            ))}
          </div>

          <div className="alarm-reasons mt-4">
            <h2>Motivo de Alarma</h2>
            <div className="alarm-history">
              {alarmReasons.map((reason, index) => (
                <div key={index} className="alarm-entry">
                  <strong>{reason.user}:</strong> <span>{reason.reason}</span>
                </div>
              ))}
            </div>
          </div>

          <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
            <DialogTitle>
              ¿Está seguro que desea activar la alarma de emergencia?
            </DialogTitle>
            <DialogContent>
              <p style={{ textAlign: "center" }}>
                En ese caso, escribe un motivo por el cual desea activar para
                informar a los demás integrantes del grupo.
              </p>
              <textarea
                value={alarmReason}
                onChange={handleAlarmReasonChange}
                placeholder="Escriba el motivo para activar la alarma"
                className="form-control"
                rows={4}
                style={{ resize: "none" }}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDialog(false)} color="secondary">
                No, Ignorar
              </Button>
              <Button onClick={handleConfirmAlarm} color="primary">
                Sí, Activar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </section>
    </>
  );
};

export default ActivacionAlarma;
