import axios from "axios";
import Cookies from 'js-cookie';

const clienteAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://seepapp.azurewebsites.net',
    withCredentials: true, // Esta línea es crucial para enviar cookies con las solicitudes
});

// Interceptor para agregar el token a las solicitudes
clienteAxios.interceptors.request.use(config => {
    const token = Cookies.get('token');
    console.log("Token obtenido de las cookies:", token); // Log para depuración
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default clienteAxios;
