import React from "react";
// Aquí se importará Navigate y Outlet de react-router-dom para manejar la navegación
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ isAllowed, children, redirectTo="/login" }) => {

  // Define el componente funcional ProtectedRoute que recibe tres props: isAllowed, children y redirectTo
  if (!isAllowed) { // Verifica si el usuario no está autorizado para acceder a la ruta

    // Si el usuario no está autorizado, redirige a la ruta especificada en redirectTo
    return <Navigate to={redirectTo} replace />; // Replace evita que el usuario pueda regresar a la página anterior
  }
  
  // Si el usuario está autorizado, renderiza los componentes hijos (children) o un Outlet si no hay hijos
  return children ? children : <Outlet />;
}
