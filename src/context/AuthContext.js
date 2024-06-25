import React, { createContext, useState, useContext, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import clienteAxios from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvide");
  return context;
};

// Función para cifrar los datos del userProfile
const encryptUserProfile = (userProfile) => {
  const encryptedProfile = CryptoJS.AES.encrypt(
    JSON.stringify(userProfile),
    "secret_key"
  ).toString();
  return encryptedProfile;
};

// Función para descifrar los datos del userProfile
const decryptUserProfile = (encryptedProfile) => {
  const bytes = CryptoJS.AES.decrypt(encryptedProfile, "secret_key");
  const decryptedProfile = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedProfile;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const isAuthenticatedSesionStorage = sessionStorage.getItem("isAuthenticated");
    const userRoleSesionStorage = sessionStorage.getItem("userRole");
    const userProfileSesionStorage = sessionStorage.getItem("userProfile");

    if (
      isAuthenticatedSesionStorage &&
      userRoleSesionStorage &&
      userProfileSesionStorage
    ) {
      setIsAuthenticated(true);
      setUserRole(userRoleSesionStorage);
      const decryptedProfile = decryptUserProfile(userProfileSesionStorage);
      setUserProfile(decryptedProfile);
    }
  }, []);

  const handleLogin = async (navigate, formData) => {
    try {
      const res = await clienteAxios.post("/login", formData);
      setIsAuthenticated(true);
      setUserRole(res.data.usuario.rol_usuario);
      setUserProfile(res.data.usuario);
      const token = res.data.token;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isAuthenticated", true);
      sessionStorage.setItem("userRole", res.data.usuario.rol_usuario);
      const encryptedProfile = encryptUserProfile(res.data.usuario);
      sessionStorage.setItem("userProfile", encryptedProfile);
      navigate(`/${res.data.usuario.rol_usuario}`);
    } catch (error) {
      console.error("Error al inciar Sesión: ", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await clienteAxios.post('/logout');
      // Limpiar todos los datos de sessionStorage
      sessionStorage.clear();
      setIsAuthenticated(false);
      setUserRole(null);
      setShowNav(false);
      return <Navigate to="/login" />;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        userRole,
        handleLogin,
        handleLogout,
        showNav,
        setShowNav
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
