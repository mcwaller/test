import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, Button } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function AgregarUsuario() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido:'',
    username:'',
    email: '',
    telefono: '',
    direccion:'',
    password: '',
  });

  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);
  const [errors, setErrors] = useState({
    nombre: '',
    apellido:'',
    username:'',
    email: '',
    telefono: '',
    direccion:'',
    password: '',
    confirmarPassword: '',
  });

  useEffect(() => {
    axios
      .get('http://localhost:3011/api/usuario/obtenerusuarios')
      .then((res) => {
        setUsuariosRegistrados(res.data);
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const agregarusuario = () => {
    const { nombre, apellido, username, email, telefono, direccion, password } = formData;
    let formIsValid = true;
    const newErrors = {};

    if (nombre.trim() === '') {
      newErrors.nombre = 'Este campo es obligatorio';
      formIsValid = false;
    }
    if (apellido.trim() === '') {
      newErrors.apellido = 'Este campo es obligatorio';
      formIsValid = false;
    }
    if (username.trim() === '') {
      newErrors.username = 'Este campo es obligatorio';
      formIsValid = false;
    }
    if (email.trim() === '') {
      newErrors.email = 'Este campo es obligatorio';
      formIsValid = false;
    }
    if (telefono.trim() === '') {
      newErrors.telefono = 'Este campo es obligatorio';
      formIsValid = false;
    }
    if (direccion.trim() === '') {
      newErrors.direccion = 'Este campo es obligatorio';
      formIsValid = false;
    }
    if (password.trim() === '') {
      newErrors.password = 'Este campo es obligatorio';
      formIsValid = false;
    }
    if (confirmarPassword.trim() === '') {
      newErrors.confirmarPassword = 'Este campo es obligatorio';
      formIsValid = false;
    }
    if (password !== confirmarPassword) {
      newErrors.confirmarPassword = 'Las contraseñas no coinciden';
      formIsValid = false;
    }
    const usuarioDuplicado = usuariosRegistrados.find(
      (usuario) => usuario.email === email
    );
    if (usuarioDuplicado) {
      newErrors.email = 'Este usuario ya está registrado';
      formIsValid = false;
    }

    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    // Envío de datos al servidor
    axios.post('http://localhost:3011/api/usuario/agregarusuario', formData)
      .then(response => {
        alert('Usuario registrado exitosamente!');
        // Resetear formulario
        setFormData({
          nombre: '',
          apellido: '',
          username: '',
          email: '',
          telefono: '',
          direccion: '',
          password: '',
        });
        setConfirmarPassword('');
        setErrors({});
      })
      .catch(error => {
        alert('Hubo un problema al registrar al usuario.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '90vh', paddingTop: '5vh' }}>
    <div style={{ padding: '50px', borderRadius: '5px', width: '450px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registro</h2>
      
      <div style={{ marginBottom: '25px' }}>
        <TextField
          type='text'
          variant='outlined'
          label='Nombre'
          name='nombre'
          value={formData.nombre}
          onChange={handleChange}
          error={!!errors.nombre}
          helperText={errors.nombre}
          fullWidth
        />
        <TextField
            type='text'
            variant='outlined'
            label='Apellido'
            name='apellido'
            value={formData.apellido}
            onChange={handleChange}
            error={!!errors.apellido}  // Si tienes validación para el username
            helperText={errors.apellido} // Si tienes validación para el username
            fullWidth
            style={{ marginTop: '20px' }}
             />
          <TextField
            type='text'
            variant='outlined'
            label='Username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}  // Si tienes validación para el username
            helperText={errors.username} // Si tienes validación para el username
            fullWidth
            style={{ marginTop: '20px' }}
             />
          <TextField
          type='email'
          variant='outlined'
          label='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          style={{ marginTop: '20px' }}
        />
        <TextField
          type='text'
          variant='outlined'
          label='Telefono'
          name='telefono'
          value={formData.telefono}
          onChange={handleChange}
          error={!!errors.telefono}
          helperText={errors.telefono}
          fullWidth
          style={{ marginTop: '20px' }}
        />
         <TextField
            type='text'
            variant='outlined'
            label='Direccion'
            name='direccion'
            value={formData.direccion}
            onChange={handleChange}
            error={!!errors.direccion}  // Si tienes validación para el username
            helperText={errors.direccion} // Si tienes validación para el username
            fullWidth
            style={{ marginTop: '20px' }}
             />
        <TextField
          type='password'
          variant='outlined'
          label='Password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          style={{ marginTop: '20px' }}
        />
        <TextField
          type='password'
          variant='outlined'
          label='Confirmar Password'
          name='confirmarPassword'
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          error={!!errors.confirmarPassword}
          helperText={errors.confirmarPassword}
          fullWidth
          style={{ marginTop: '20px' }}
        />
        <Button
          onClick={agregarusuario}
          variant='contained'
          color='primary'
          size='large'
          fullWidth
          style={{ marginTop: '30px' }}
        >
          Agregar
        </Button>
      </div>
    </div>
  </div>
  );
}

export default AgregarUsuario;


