import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";


const AlarmDialog = ({ open, onClose, onConfirm, alarmReason, onReasonChange }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>¿Está seguro que desea activar la alarma de emergencia?</DialogTitle>
    <p>
      <center>
        En ese caso, escribe un motivo por el cual desea activar para informar a los demás integrantes del grupo.
      </center>
    </p>
    <DialogContent>
      <textarea
        value={alarmReason}
        onChange={onReasonChange}
        placeholder="Escriba el motivo para activar la alarma"
        className="form-control"
        rows={4}
        style={{ resize: "none" }}
      ></textarea>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">No, Ignorar</Button>
      <Button onClick={onConfirm} color="primary">Sí, Activar</Button>
    </DialogActions>
  </Dialog>
);

export default AlarmDialog;
