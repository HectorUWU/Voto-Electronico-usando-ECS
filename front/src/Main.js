import React from "react";
import { Routes, Route} from "react-router-dom";

import Home from "./components/Home";
import SingIn from "./components/SingIn";
import Registro from "./components/Registro";
import VotanteMenu from "./components/VotanteMenu";
import VotanteVotar from "./components/VotanteVotar";
import VotanteVerCandidatos from "./components/VotanteVerCandidatos";
import MesaMenu from "./components/MesaMenu";

const Main = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/SingIn" element={<SingIn/>}></Route>
        <Route path="/registro" element={<Registro/>}></Route>
        <Route path="/votante/menuPrincipal" element={<VotanteMenu />}></Route>
        <Route path="/votante/votar" element={<VotanteVotar />}></Route>
        <Route path="/votante/verCandidatos" element={<VotanteVerCandidatos />}></Route>
        <Route path="/mesa/menuPrincipal" element={<MesaMenu />}></Route> 
      </Routes>
  );
};

export default Main;
