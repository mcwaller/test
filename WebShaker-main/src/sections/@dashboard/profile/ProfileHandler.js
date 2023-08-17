import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Stack, TextField, Avatar, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export default function ProfileHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || localStorage.getItem('userEmail');

  const [currentName, setCurrentName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:3011/api/usuario/usuario/${userEmail}`)
      .then((response) => {
        const user = response.data;
        setCurrentName(user.nombre || '');
        setLastName(user.apellido || '');
        setUsername(user.username || '');
        setEmail(user.email || '');
        setPhoneNumber(user.telefono || '');
        setAddress(user.direccion || '');
      })
      .catch((error) => {
        console.error('Error obteniendo datos del usuario:', error);
      });
  }, [userEmail]);

  const handleSave = () => {
    const userProfileData = {
      email: userEmail,
      nombre: currentName,
      apellido: lastName === '' ? 'EMPTY_FIELD' : lastName,
      username: username === '' ? 'EMPTY_FIELD' : username,
      telefono: phoneNumber === '' ? 'EMPTY_FIELD' : phoneNumber,
      direccion: address === '' ? 'EMPTY_FIELD' : address,
    };

    axios
      .put('http://localhost:3011/api/usuario/update', userProfileData)
      .then((response) => {
        console.log('Perfil actualizado con éxito:', response.data);
        navigate('#', { replace: true });
      })
      .catch((error) => {
        console.error('Error actualizando el perfil:', error);
      });
  };

  const handleDeleteFields = () => {
    const fieldsToDelete = [];

    if (!username) fieldsToDelete.push('username');
    if (!lastName) fieldsToDelete.push('apellido');
    if (!phoneNumber) fieldsToDelete.push('telefono');
    if (!address) fieldsToDelete.push('direccion');

    if (fieldsToDelete.length === 0) {
      console.log('No hay campos vacíos para eliminar');
      return;
    }

    axios
      .delete('http://localhost:3011/api/usuario/delete', {
        data: {
          email: userEmail,
          fields: fieldsToDelete,
        },
      })
      .then((response) => {
        console.log('Campos borrados con éxito:', response.data);
        if (fieldsToDelete.includes('username')) setUsername('');
        if (fieldsToDelete.includes('apellido')) setLastName('');
        if (fieldsToDelete.includes('telefono')) setPhoneNumber('');
        if (fieldsToDelete.includes('direccion')) setAddress('');
      })
      .catch((error) => {
        console.error('Error al borrar los campos:', error);
      });
  };

  const handleCancel = () => {
    setCurrentName('');
    setLastName('');
    setUsername('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
  };

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '90vh', paddingTop: '0vh' }}
    >
      <div style={{ padding: '50px', borderRadius: '5px', width: '600px', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
        <Avatar
          src="/assets/images/avatars/default.jpg"
          sx={{ width: 200, height: 200, marginBottom: '10%', marginLeft: 11 }}
        />
        <Stack spacing={3}>
          <TextField
            name="currentName"
            label="Nombre"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            fullWidth
          />
          <TextField
            name="lastName"
            label="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
          <TextField
            name="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField name="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField
            name="address"
            label="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
          <TextField
            name="phone"
            label="Número de Teléfono"
            value={phoneNumber}
            InputProps={{
              inputProps: {
                pattern: '[0-9]*',
              },
              onInput: (event) => {
                event.target.value = event.target.value.replace(/[^0-9]/g, '').slice(0, 10);
              },
            }}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
          />
        </Stack>
        <LoadingButton fullWidth size="large" variant="contained" onClick={handleSave} style={{ marginTop: 20 }}>
          Guardar
        </LoadingButton>
        <Button
          fullWidth
          size="large"
          variant="outlined"
          color="secondary"
          onClick={handleDeleteFields}
          style={{ marginTop: 20 }}
        >
          Eliminar campos
        </Button>
        <LoadingButton
          fullWidth
          size="large"
          variant="contained"
          onClick={handleCancel}
          style={{ marginTop: 20 }}
          sx={{ bgcolor: 'red', '&:hover': { bgcolor: '#C70039' } }}
        >
          Cancelar
        </LoadingButton>
      </div>
    </div>
  );
}
