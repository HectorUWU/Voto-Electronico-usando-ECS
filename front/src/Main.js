import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import SingIn from "./components/SingIn";
import Registro from "./components/Registro";
import VotanteMenu from "./components/VotanteMenu";
import VotanteVotar from "./components/VotanteVotar";
import VotanteVerCandidatos from "./components/VotanteVerCandidatos";
import MesaMenu from "./components/MesaMenu";
import CapturaLlavePrivada from "./components/CapturaLlavePrivada";
import Resultados from "./components/Resultados";
import Verificar from "./components/Verificar";
import RegistroCandidatos from "./components/RegistroCandidatos.jsx";
import EstablecerVotacion from "./components/EstablecerVotacion";
import CambiarContrasena from "./components/CambiarContrasena";
import SolicitarRecuperacionContrasena from "./components/SolicitarRecuperacionContrasena";
import RecuperarContrasena from "./components/RecuperarContrasena";
import FormularioBoletas from "./components/FormularioBoletas";
import RegistroMesa from "./components/RegistroMesa";

const Main = () => {
  return (
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/SingIn" element={<SingIn/>}></Route>
        <Route exact path="/registro" element={<Registro/>}></Route>
        <Route exact path="/votante/menuPrincipal" element={<VotanteMenu />}></Route>
        <Route exact path="/votante/votar" element={<VotanteVotar />}></Route>
        <Route exact path="/votante/verCandidatos" element={<VotanteVerCandidatos />}></Route>
        <Route exact path="/cambiarContrasena" element={<CambiarContrasena />}></Route>
        <Route exact path="/mesa/establecerVotacion" element={<EstablecerVotacion/>}></Route>  
        <Route exact path="/mesa/menuPrincipal" element={<MesaMenu />}></Route> 
        <Route exact path="/mesa/recuperarVotos" element={<CapturaLlavePrivada />}></Route> 
        <Route exact path="/mesa/resultados" element={<Resultados />}></Route> 
        <Route exact path="/verificar/:token/:id" element={<Verificar/>}></Route>
        <Route exact path="/mesa/registrarCandidato" element={<RegistroCandidatos/>}></Route>  
        <Route exact path="/mesa/establecerVotacion" element={<EstablecerVotacion/>}></Route>
        <Route exact path="/solicitarRecuperacionContrasena" element={<SolicitarRecuperacionContrasena/>}></Route>
        <Route exact path="/recuperarContrasena/:token/:id" element={<RecuperarContrasena/>}></Route>
        <Route exact path="/mesa/validarAlumnos" element={<FormularioBoletas />}></Route>
        <Route exact path="/registroMesa/:token/:id" element={<RegistroMesa/>}></Route>
      </Routes>
  );
};

export default Main;
