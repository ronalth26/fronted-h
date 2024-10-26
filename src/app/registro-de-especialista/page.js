'use client';
import React, { useState,useEffect} from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './registroEspecialista.module.css';
import '../estilos/globales.css';
import SidebarEspecialista from '../components/sidebarEspecialista';

import useToken  from '../utils/auth';
import { useJwt } from "react-jwt";



import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from 'react-select'

import { DOMAIN_BACK, DOMAIN_FRONT } from '../../../env';

const steps = ['Datos Personales', 'Información trabajo'];

export default function RegisterSpecialist() {

  const { Token } = useToken();
  const { decodedToken, isExpired } = useJwt(Token);

  // useEffect(() => {
  //   if (isExpired || !decodedToken) {
  //     window.location.href = `${DOMAIN_FRONT}/login`;
  //   }
  // }, [isExpired, decodedToken]);


const [categorias, setCategorias] = useState([]);

useEffect(() => {
  // Fetch categories from the backend
  fetch(DOMAIN_BACK+'?controller=categorias&action=traer_categorias')
    .then(response => response.json())
    .then(data => {
      const options = data.map(item => ({
        value: item.idCategoria, // Asumiendo que 'value' es la clave que quieres usar del objeto original
        label: item.nombreCategoria  // Asumiendo que 'label' es la clave que quieres usar del objeto original
      }));
      setCategorias(options);
    })
    .catch(error => console.error('Error fetching categorias:', error));
}, []);






  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };






  const [formData, setFormData] = useState({
    fechaNacimiento: '',
    dni: '',
    fotoIdentificacion: null,
    fotoDniFrente: null,
    fotoDniAtras: null,
    confirmacionIdentidad: null,
    antecedentesNoPenales: null,
    especialidades: [],
    evidencias: null,
  });

 
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const [especialidades, setEspecialidades] = useState([])

  const handleCategorias = (e) => {
        setEspecialidades(e)
  }

  const [id_usuario, setIdUsuario] = useState(0);
  const [especialista, setEspecialista] = useState(0);

  useEffect(() => {
   if (decodedToken) {
     setIdUsuario(decodedToken.data.id);
     setEspecialista(decodedToken.data.especialista);
   }
 }, [decodedToken]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    console.log(especialidades);
    const valores = especialidades.map(especialidad => especialidad.value);
   

    console.log(JSON.stringify(valores));


    const formDataToSend = new FormData();
    formDataToSend.append('idUsuario', id_usuario);
    formDataToSend.append('fechaNacimiento', formData.fechaNacimiento);
    formDataToSend.append('documentoIdentidad', formData.dni);
    formDataToSend.append('fotoIdentificacion', formData.fotoIdentificacion);
    formDataToSend.append('fotoFrente', formData.fotoDniFrente);
    formDataToSend.append('fotoAtras', formData.fotoDniAtras);
    formDataToSend.append('fotoConfirmacion', formData.confirmacionIdentidad);
    formDataToSend.append('antecedentesPenales', formData.antecedentesNoPenales);
    formDataToSend.append('especialidades', JSON.stringify(valores));
    formDataToSend.append('evidencias', formData.evidencias);


    try {
      const response = await fetch(`${DOMAIN_BACK}?controller=usuarios&action=crear_especialista`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      console.log(response);
      console.log(data);
      if (data.estado === 1) {
        toast.success(data.mensaje);
        setTimeout(() => {
          window.location.href = DOMAIN_FRONT + 'plataforma-especialista';
        }, 2000);
      } else {
        toast.error(data.mensaje);
      }
    } catch (error) {
      console.error('Error al registrar el especialista:', error);
      toast.error('Error al registrar el especialista');
    }
  };

  const validateText = (value) => /^[a-zA-Z\s]*$/.test(value);
  const validateEmail = (value) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value);
  const validateDni = (value) => /^\d{8}$/.test(value);

  return (
    <>
       <SidebarEspecialista/>
      <ToastContainer />
      <div className="container content layout-pages" style={{maxWidth:'700px',marginTop:'10rem', marginBottom:'4rem'}}>
        <h2>Solicitud de Registro Especialista</h2>
        <form onSubmit={handleSubmit}>
              <Box sx={{ width: '100%',marginTop:'40px', marginBottom:'40px'}}>
               <Stepper nonLinear activeStep={activeStep}>
                 {steps.map((label, index) => (
                   <Step key={label} completed={completed[index]}>
                     <StepButton color="inherit" onClick={handleStep(index)}>
                       {label}
                     </StepButton>
                   </Step>
                 ))}
               </Stepper>
               <div>
                 {allStepsCompleted() ? (
                   <React.Fragment>
                     <Typography sx={{ mt: 2, mb: 1 }}>
                       All steps completed - you&apos;re finished
                     </Typography>
                     <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                       <Box sx={{ flex: '1 1 auto' }} />
                       <Button onClick={handleReset}>Reset</Button>
                     </Box>
                   </React.Fragment>
                 ) : (
                   <React.Fragment>
                     
                       {activeStep == 0 && (
                        <>
                        <div className="mb-3 mt-4">
                           <label className="form-label">Fecha de Nacimiento:</label>
                           <input
                             type="date"
                             className="form-control"
                             name="fechaNacimiento"
                             value={formData.fechaNacimiento}
                             onChange={handleChange}
                             required
                           />
                         </div>
                         <div className="mb-3">
                           <label className="form-label">N° de Documento de Identidad:</label>
                           <input
                             type="text"
                             className="form-control"
                             name="dni"
                             value={formData.dni}
                             onChange={handleChange}
                             required
                             pattern="\d{8}"
                             title="El DNI debe contener 8 dígitos"
                           />
                         </div>
                         <div className="mb-3">
                           <label className="form-label">Foto de Identificación:</label>
                           <input
                             type="file"
                             className="form-control"
                             name="fotoIdentificacion"
                             onChange={handleFileChange}
                             required
                             accept="image/*"
                           />
                         </div>
                         <div className="mb-3">
                           <label className="form-label">Foto de DNI (Frente):</label>
                           <input
                             type="file"
                             className="form-control"
                             name="fotoDniFrente"
                             onChange={handleFileChange}
                             required
                             accept="image/*"
                           />
                         </div>
                         <div className="mb-3">
                           <label className="form-label">Foto de DNI (Parte Trasera):</label>
                           <input
                             type="file"
                             className="form-control"
                             name="fotoDniAtras"
                             onChange={handleFileChange}
                             required
                             accept="image/*"
                           />
                         </div>
                         <div className="mb-3">
                           <label className="form-label">Confirmación de Identidad (Foto con DNI):</label>
                           <input
                             type="file"
                             className="form-control"
                             name="confirmacionIdentidad"
                             onChange={handleFileChange}
                             required
                             accept="image/*"
                           />
                         </div>
                         <div className="mb-3">
                           <label className="form-label">Imagen de Antecedentes no Penales:</label>
                           <input
                             type="file"
                             className="form-control"
                             name="antecedentesNoPenales"
                             onChange={handleFileChange}
                             required
                             accept="image/*,application/pdf"
                           />
                         </div>
                        </>

                       )}

                       {activeStep == 1 && (
                        <>
                          <div className="mb-3 mt-4">
                           <label className="form-label">Selecciona tus especialidades:</label>
                           <Select
                            isMulti
                            name="especialidades"
                            options={categorias}
                            onChange={(e)=>handleCategorias(e)}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                         </div>
                         <div className="mb-3">
                           <label className="form-label">Adjunta las evidencias previas:</label>
                           <input
                             type="file"
                             className="form-control"
                             name="evidencias"
                             onChange={handleFileChange}
                             required
                             accept="image/*,application/pdf"
                           />
                         </div>
                         
                         <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Enviar Información</button>
                        </>
                       )}


                     <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                       <Button
                         color="inherit"
                         disabled={activeStep === 0}
                         onClick={handleBack}
                         sx={{ mr: 1 }}
                       >
                         Anterior
                       </Button>
                       <Box sx={{ flex: '1 1 auto' }} />
                       {activeStep !== 1 && (
                          <Button onClick={handleNext} sx={{ mr: 1 }}>
                            Siguiente
                          </Button>
                        )}
                     </Box>
                   </React.Fragment>
                 )}
               </div>
             </Box>
       </form>
      </div>
    </>
  );
}
