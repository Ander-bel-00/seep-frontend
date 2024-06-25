import React from 'react';
import { AiFillContacts , AiFillIdcard, AiFillFileAdd  } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './layouts/FooterComponent';
import './css/admin.css';
import Footer from './layouts/FooterComponent';

function Administrador() {
  return (
    <div className='contenedor-admin'>
      <h1 className="titulo-panel">Panel de control</h1>

      <Link to="/admin/crear-ficha">
        <div className="icon-box">
          <AiFillFileAdd className="icon" size={120} />
          <span>Crear Ficha</span>
        </div>
      </Link>

      <Link to="/admin/crear-instructor">
        <div className="icon-box">
          <AiFillContacts className="icon" size={120} />
          <span>Crear Instructor</span>
        </div>
      </Link>

      <Link to="/admin/crear-aprendiz">
        <div className="icon-box">
          <AiFillIdcard className="icon" size={120} />
          <span>Crear Aprendiz</span>
        </div>
      </Link>
    </div>
  )
}

export default Administrador;
