import React, { Fragment, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Importa BrowserRouter
import LoginForm from "./componentes/login/LoginForm";
import NavbarAprendiz from "./componentes/aprendices/layouts/Navabar-Aprendiz";
import NavbarAdmin from "./componentes/admin/layouts/NavabarAdmin.js";
import Aprendices from "./componentes/aprendices/Aprendiz";
import Administrador from "./componentes/admin/Administrador";
import Instructor from "./componentes/instructores/Instructor";
import Header from "./componentes/layouts/Header";
import ListaAprendices from "./componentes/instructores/listaAprendices/ListaAprendices.js";
import Calendario from "./componentes/calendario/Calendario.js";
import NavbarInstructor from "./componentes/instructores/layouts/NavbarInstructor.js";
import NuevaFicha from "./componentes/fichas/NuevaFicha.js";
import NuevoAprendiz from "./componentes/aprendices/nuevoAprendiz/NuevoAprendiz.js";
import Documents from "./componentes/Documents/Documents.js";
import InstructorDocuments from "./componentes/Documents/InstructorDocuments.js";
import Bitacoras from "./componentes/bitacoras/Bitacoras.js";
import BitacorasInstructor from "./componentes/bitacoras/BitacorasInstructor.js";
import RecuperaContrasena from "./componentes/login/recuperarContrasena/RecuperaContrasena.js";
import AprendizForm from "./componentes/formularios/AprendizForm.js";
import FichasForm from "./componentes/formularios/FichasForm.js";
import InstructorForm from "./componentes/formularios/InstructorForm.js";
import { ProtectedRoute } from "./ProtectedRoute.js";
import AgendaContainer from "./componentes/agenda/AgendaContainer/AgendaContainer.js";
import { useAuth } from "./context/AuthContext.js";
import FormularioCompleto from "./componentes/SeguimientoEP/FormularioCompleto/FormIPSE.js";

function App() {
  const { isAuthenticated, userRole, handleLogout, showNav, setShowNav } =
    useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEmpresaOpen, setModalEmpresaOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to={`/${userRole}`} /> : <Navigate to="/login"/>
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={`/${userRole}`} /> : <LoginForm />
          }
        />
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : (
              <ProtectedRoute userRole={sessionStorage.getItem("userRole")} />
            )
          }
        />

        <Route
          path="/restablecimiento-contrasena"
          element={<RecuperaContrasena />}
        />

        {/* Rutas protegidas, solo accede el rol aprendiz */}
        <Route
          path="/aprendiz/*"
          element={
            <ProtectedRoute
              isAllowed={
                !!sessionStorage.getItem("isAuthenticated") &&
                sessionStorage.getItem("userRole") === "aprendiz"
              }
              redirectTo="/login"
            >
              <Fragment>
                <Header showNav={showNav} setShowNav={setShowNav} />
                <NavbarAprendiz
                  showNav={showNav}
                  handleLogout={handleLogout}
                  setShowNav={setShowNav}
                  modalIsOpen={modalIsOpen}
                  modalEmpresaOpen={modalEmpresaOpen}
                />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <main className="main-container">
                        <Aprendices
                          setModalIsOpen={setModalIsOpen}
                          setModalEmpresaOpen={setModalEmpresaOpen}
                        />
                      </main>
                    }
                  />
                  <Route
                    path=":id_aprendiz/bitacoras-aprendiz"
                    element={
                      <main className="bitacoras-aprendizUser-main">
                        <Bitacoras setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                  <Route
                    path=":id_aprendiz/documents-aprendiz"
                    element={
                      <main className="documents-aprendiz-main">
                        <Documents setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                </Routes>
              </Fragment>
            </ProtectedRoute>
          }
        />
        {/* Rutas protegidas a las que accederá el rol de instructor */}
        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute
              isAllowed={
                !!sessionStorage.getItem("isAuthenticated") &&
                sessionStorage.getItem("userRole") === "instructor"
              }
              redirectTo="/login"
            >
              <Fragment>
                <Header showNav={showNav} setShowNav={setShowNav} />
                <NavbarInstructor
                  showNav={showNav}
                  handleLogout={handleLogout}
                  setShowNav={setShowNav}
                  modalIsOpen={modalIsOpen}
                />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <main className="main-container">
                        <Instructor setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                  <Route
                    path=":id_instructor/documents-instructor"
                    element={
                      <main className="main-ins-bitacoras documents-main-cont">
                        <InstructorDocuments setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                  <Route
                    path=":id_instructor/bitacoras-instructor"
                    element={
                      <BitacorasInstructor setModalIsOpen={setModalIsOpen} />
                    }
                  />

                  <Route
                    path="aprendicesFicha/:numero_ficha"
                    element={
                      <main className="main-container">
                        <ListaAprendices
                          isAuthenticated={isAuthenticated}
                          setModalIsOpen={setModalIsOpen}
                        />
                      </main>
                    }
                  />
                  <Route
                    path=":id_instructor/nuevaFicha"
                    element={
                      <main className="main-container">
                        <NuevaFicha setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                  <Route
                    path=":id_instructor/aprendiz-add"
                    element={
                      <main className="new-aprendiz-content">
                        <NuevoAprendiz setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />

                  <Route
                    path="visitas-add/:numero_ficha/:id_aprendiz"
                    element={
                      <div className="main-container">
                        <Calendario setModalIsOpen={setModalIsOpen} />
                      </div>
                    }
                  />
                  <Route
                    path="agenda/visitas"
                    element={
                      <main className="agenda-main-container">
                        <AgendaContainer setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                  <Route
                    path="agenda/visitas/visitas-add/:numero_ficha/:id_aprendiz"
                    element={
                      <div className="main-container">
                        <Calendario setModalIsOpen={setModalIsOpen} />
                      </div>
                    }
                  />

                  <Route
                    path="evaluacion-EP/:id_aprendiz"
                    element={
                      <main className="main-container">
                        <FormularioCompleto setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                </Routes>
              </Fragment>
            </ProtectedRoute>
          }
        />
        {/* Rutas protegidas a las qeu accederá el rol Administrador */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute
              isAllowed={
                !!sessionStorage.getItem("isAuthenticated") &&
                sessionStorage.getItem("userRole") === "admin"
              }
              redirectTo="/login"
            >
              <Fragment>
                <Header showNav={showNav} setShowNav={setShowNav} />
                <NavbarAdmin
                  showNav={showNav}
                  handleLogout={handleLogout}
                  setShowNav={setShowNav}
                />

                <Routes>
                  <Route
                    path="/"
                    element={
                      <main className="main-container">
                        <Administrador />
                      </main>
                    }
                  />
                  <Route
                    path="/crear-ficha"
                    element={
                      <main className="main-container">
                        <FichasForm setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                  <Route
                    path="/crear-aprendiz"
                    element={
                      <main className="new-aprendiz-content">
                        <NuevoAprendiz setModalIsOpen={setModalIsOpen} />
                      </main>
                    }
                  />
                  <Route
                    path="/crear-instructor"
                    element={
                      <main className="main-container">
                        <InstructorForm />
                      </main>
                    }
                  />
                </Routes>
              </Fragment>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
