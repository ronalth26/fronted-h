'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Sidebar from '../components/sidebar';
import SidebarEspecialista from '../components/sidebarEspecialista';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import '../estilos/globales.css';

const ChatApp = () => {
  // Estado para manejar el chat
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);

  // Referencia al contenedor de mensajes
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages'));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    const newMessage = {
      userId: 3,
      username: 'Carlos Díaz',
      message: message,
      image: image,
      timestamp: new Date().toLocaleTimeString(),
      isConnected: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    setImage(null);
    toast.success("Mensaje enviado");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ToastContainer />
      <Sidebar /> {/* Sidebar de navegación */}

      <section className="chat-section" style={{ marginTop: '5rem' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">Chat de Grupo</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-8">
              <div className="wrap">
                <div className="chat-wrap p-4 p-md-5" style={{ width: '100%' }}>
                  <div className="messages-container" style={{ height: '500px', overflowY: 'scroll', marginBottom: '20px' }}>
                    {messages.map((msg, index) => (
                      <div key={index} className={`message ${msg.isConnected ? 'connected' : 'disconnected'}`} style={{ marginBottom: '15px' }}>
                        <div className="user-info" style={{ marginBottom: '5px' }}>
                          <span className="username">{msg.username}</span>
                          <span className="timestamp">{msg.timestamp}</span>
                          <div className={`status ${msg.isConnected ? 'online' : 'offline'}`}></div>
                        </div>
                        <p>{msg.message}</p>
                        {msg.image && (
                          <div className="message-image" style={{ maxWidth: '100%', marginBottom: '10px' }}>
                            <img src={msg.image} alt="Imagen adjunta" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }} />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje"
                    style={{ width: '100%' }}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />

                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-primary form-control"
                      onClick={handleSendMessage}
                    >
                      Enviar Mensaje
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="user-list">
                <h3>Usuarios Conectados</h3>
                <div className="user" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="status online" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'green', marginRight: '10px' }}></div>
                  <span>Juan Pérez</span>
                </div>
                <div className="user" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="status offline" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'red', marginRight: '10px' }}></div>
                  <span>María González</span>
                </div>
                <div className="user" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="status online" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'green', marginRight: '10px' }}></div>
                  <span>Carlos Díaz</span>
                </div>
                <div className="user" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="status offline" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'red', marginRight: '10px' }}></div>
                  <span>Lucía Fernández</span>
                </div>
              </div>

              <div className="social-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style={{ width: '40px', height: '40px' }} />
                </a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" style={{ width: '40px', height: '40px' }} />
                </a>
                <a href="https://t.me/" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Telegram_2019_simple_logo.svg" alt="Telegram" style={{ width: '40px', height: '40px' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Mensaje Enviado</DialogTitle>
        <DialogContent>
          <center>
            <img src='/terminada.png' width='60%' alt="mensaje enviado" />
          </center>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatApp;
