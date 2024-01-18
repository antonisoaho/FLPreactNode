const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router
  .get('/', (req, res) => {
    User.find()
      .sort({ createdAt: -1 })
      .then((result) => {
        const parsedResult = result.map((person) => ({
          _id: person._id,
          name: person.name,
          isAdmin: person.isAdmin,
        }));

        res.send(parsedResult);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Ett fel inträffade vid hämtning av användare.' });
      });
  })
  .get('/singleuser/:id', (req, res) => {
    const { isAdmin } = req.user;
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Ogiltigt användar-ID.' });
    }

    if (isAdmin) {
      User.findById(userId)
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(500).json({ error: 'Fel vid inläsning av användare.' });
        });
    }
  })
  .patch('/singleuser/:id', async (req, res) => {
    const userId = req.params.id;
    const { isAdmin, userId: loggedInUser } = req.user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Ogiltigt användar-ID.' });
    }

    if (!isAdmin && userId !== loggedInUser) {
      return res.status(403).json({ error: 'Obehörig åtkomst till att ändra vald användare.' });
    }
    try {
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'Användaren hittades inte.' });
      }

      const { name, email, password, isAdmin: newRole } = req.body.newData;

      name && (existingUser.name = name);
      email && (existingUser.email = email);
      password && (existingUser.password = password);
      newRole !== undefined && (existingUser.isAdmin = newRole);

      const updatedUser = await existingUser.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Ett fel inträffade vid uppdatering av användaren.' });
    }
  })
  .delete('/singleuser/:id', async (req, res) => {
    const userId = req.params.id;
    const { isAdmin } = req.user;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Ogiltigt användar-ID.' });
    }

    if (isAdmin) {
      try {
        await User.findByIdAndDelete(userId);

        res.status(200).send('Användare borttagen.');
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Ett fel inträffade vid borttagning av användare.' });
      }
    }
  })
  .get('/getme', (req, res) => {
    const token = req.headers['authorization'];
    const decryptedToken = jwt.decode(token);

    User.findById(decryptedToken.userId)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        if (token) invalidateToken(token);
        res.send(err.status);
      });
  })
  .get('/logout', (req, res) => {
    const token = req.headers['authorization'];

    invalidateToken(token);

    res.status(200).send();
  })
  .post('/createuser', async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        res.status(409).json({ error: 'Email finns redan registrerad.' });
        return;
      }
      const user = new User({ ...req.body });
      const result = await user.save();
      console.log(result);
      res.status(201).send(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
