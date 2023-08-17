/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
     

    axios
    .post('http://localhost:3011/api/users/login', formData)
    .then((res) => {
        if (res.data.Status === 'Success') {
            const userEmail = res.data.email;
            localStorage.setItem('userEmail', userEmail);
            navigate('/dashboard', { state: { email: userEmail } });
            console.log(userEmail)
        } else {
            // Aquí estamos suponiendo que si el status no es "Success", hay un mensaje de error en la respuesta.
            setError(res.data.message);
        }
    })
    .catch((err) => {
        if (err.response) {
            // Si el servidor respondió con un error, este error puede contener un mensaje.
            setError(err.response.data.message);
        } else {
            // Si hay un error pero no viene del servidor, probablemente es un problema de conexión.
            setError('Hubo un problema de conexión. Por favor, inténtalo de nuevo.');
        }
        console.log(err);
    });
  

  
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '90vh', paddingTop: '5vh' }}>
    <div style={{ padding: '50px', borderRadius: '5px', width: '450px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h2>
      {error && <div style={{ backgroundColor: 'red', color: 'white', padding: '15px', borderRadius: '5px', marginBottom: '30px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Email
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              style={{ width: '100%', padding: '18px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '17px' }}
              onChange={handleChange}
              value={formData.email}
            />
          </label>
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Password
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              style={{ width: '100%', padding: '18px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '17px' }}
              onChange={handleChange}
              value={formData.password}
            />
          </label>
        </div>
        <button type="submit" style={{ width: '100%', padding: '18px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '17px' }}>Login</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '30px' }}>
        Don’t have an account? <Link to="/register" style={{ textDecoration: 'none', color: '#007BFF' }}>Get started</Link>
      </p>
    </div>
  </div>
  );
}

export default LoginForm;

