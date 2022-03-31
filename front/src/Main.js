import React from "react";
import { Routes, Route} from "react-router-dom";

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

const Main = () => {
  return (
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/SingIn" element={<SingIn/>}></Route>
        <Route exact path="/registro" element={<Registro/>}></Route>
        <Route exact path="/votanteMenuPrincipal" element={<VotanteMenu />}></Route>
        <Route exact path="/votante/votar" element={<VotanteVotar />}></Route>
        <Route exact path="/votante/verCandidatos" element={<VotanteVerCandidatos />}></Route>
        <Route exact path="/mesaMenuPrincipal" element={<MesaMenu />}></Route> 
        <Route exact path="/mesa/recuperarVotos" element={<CapturaLlavePrivada />}></Route> 
        <Route exact path="/mesa/resultados" element={<Resultados />}></Route> 
        <Route exact path="/verificar/:token/:id" element={<Verificar/>}></Route>
        <Route exact path="/mesa/registrarCandidato" element={<RegistroCandidatos/>}></Route>  
        <Route exact path="/mesa/establecerVotacion" element={<EstablecerVotacion/>}></Route>  
      </Routes>
  );
};

export default Main;
