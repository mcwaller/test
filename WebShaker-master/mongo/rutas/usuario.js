const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
app.use(cors());




const mongoose = require('mongoose')
const eschema = mongoose.Schema

const eschemausuario = new eschema({
    nombre: String,
    apellido:String,
    username:String,
    email: String,
    telefono: String,
    direccion:String,
    password:String,
    idusuario:String
})

const ModeloUsuario = mongoose.model('usuarios', eschemausuario)
module.exports = router


// Resto del código de las rutas del usuario
router.post('/login', cors(), (req, res) => {
    console.log("Received login request for email:", req.body.email);

    const { email, password } = req.body;

    ModeloUsuario.findOne({ email: email })
        .then((user) => {
            if (user) {
                console.log("Found user:", user.email);
                
                bcrypt.compare(password, user.password, (err, response) => {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                    if (response) {
                        const token = jwt.sign({ email: user.email }, 'jwt-secret-key', {
                            expiresIn: '1d',
                        });
                        res.cookie('token', token, {
                            httpOnly: true,
                            sameSite: 'none',
                            secure: true,
                        });
                        return res.status(200).json({ Status: 'Success', email: user.email, token: token });
                    } else {
                        console.warn("Incorrect password attempt for:", user.email);
                        return res.status(401).json({ message: 'The password is incorrect' });
                    }
                });

            } else {
                console.warn("User not found for email:", email);
                return res.status(404).json({ message: 'No record existed' });
            }
        })
        .catch(err => {
            console.error("Error fetching user:", err);
            return res.status(500).json({ message: 'Internal server error' });
        });
});


router.get('/verifyToken', cors(), (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.status(200).json({ email: decoded.email });
  });
});

router.post('/logout', cors(), (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: true });
  return res.status(200).json({ message: 'Logout successful' });
});








router.get('/obtenerusuarios', async (req, res) => {
  try {
    const usuarios = await ModeloUsuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});




router.post('/agregarusuario', async (req, res) => {
    const { nombre,apellido, username, email, telefono,direccion, password, idusuario } = req.body;
  
    // Verificar si el usuario ya existe por email
    const usuarioExistente = await ModeloUsuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).send('El usuario ya está registrado.');
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const nuevousuario = new ModeloUsuario({
        nombre,
        apellido,
        username,
        email,
        telefono,
        direccion,
        password: hashedPassword,
        idusuario,
      });
      await nuevousuario.save();
      res.send('Usuario agregado correctamente');
    } catch (error) {
      res.send(error);
      console.log(error)
    }
  });
  
  router.put('/update', async (req, res) => {
    const { email, nombre, apellido, username, telefono, direccion } = req.body;

    let updateFields = {};

    // Añade lógica para verificar cada campo y asignar un valor si se envió.
    if (nombre !== undefined) updateFields.nombre = nombre;
    if (apellido !== undefined) updateFields.apellido = apellido;
    if (username !== undefined) updateFields.username = username;
    if (telefono !== undefined) updateFields.telefono = telefono;
    if (direccion !== undefined) updateFields.direccion = direccion;

    try {
        const updatedUser = await ModeloUsuario.findOneAndUpdate(
            { email: email },
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }

        return res.send({ message: 'Perfil actualizado con éxito.', user: updatedUser });
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar el perfil.' });
    }
});

router.delete('/delete', async (req, res) => {
  const { email, fields } = req.body;  // Recibimos el email y los campos a borrar

  if (!email || !fields) {
      return res.status(400).send({ message: 'Se requiere email y campos para borrar.' });
  }

  let fieldsToUpdate = {};
  fields.forEach(field => {
      fieldsToUpdate[field] = ''; // Establecer los campos específicos a valores vacíos
  });

  try {
      const updatedUser = await ModeloUsuario.findOneAndUpdate(
          { email: email },
          fieldsToUpdate,
          { new: true }
      );
      
      if (!updatedUser) {
          return res.status(404).send({ message: 'Usuario no encontrado.' });
      }

      return res.send({ message: 'Campos borrados con éxito.', user: updatedUser });
  } catch (err) {
      return res.status(500).send({ message: 'Error al borrar los campos del perfil.' });
  }
});





router.get('/usuario/:email', async (req, res) => {
  try {
    const usuario = await ModeloUsuario.findOne({ email: req.params.email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

