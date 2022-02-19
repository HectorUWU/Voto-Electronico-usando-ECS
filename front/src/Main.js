import React from "react";
import { Routes, Route} from "react-router-dom";

import Home from "./components/Home";
import SingIn from "./components/SingIn";
import Registro from "./components/Registro";
import VotanteMenu from "./components/VotanteMenu";
import MesaMenu from "./components/MesaMenu";

const Main = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/SingIn" element={<SingIn/>}></Route>
        <Route path="/registro" element={<Registro/>}></Route>
        <Route path="/votante/menuPrincipal" element={<VotanteMenu />}></Route>
        <Route path="/mesa/menuPrincipal" element={<MesaMenu />}></Route>
      </Routes>
  );
};

export default Main;
