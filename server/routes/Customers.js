const express = require('express');
const router = express.Router();
const { Customer } = require('../models/customers');
const mongoose = require('mongoose');

router
  // get all Customers
  .get('/', async (req, res) => {
    try {
      const { userId, isAdmin } = req.user;
      let query = {};

      if (!isAdmin) query.advisor = userId;

      const result = await Customer.find(query).sort({ createdAt: -1 });
      const parsedResult = result.map((cust) => ({
        advisorId: cust.advisor,
        custId: cust._id,
        customerNames: cust.customerDetails.map((customers) => customers.name),
        lastUpdate: cust.updatedAt,
      }));

      res.send(parsedResult);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Fel vid inhämtning av kunder.' });
    }
  })

  // Create new customer
  .post('/create', async (req, res) => {
    const { userId } = req.user;

    try {
      const customer = new Customer({ advisor: userId });
      const result = await customer.save();

      const parsedResult = {
        advisorId: userId,
        custId: result._id,
        lastUpdate: result.updatedAt,
      };

      res.status(201).send(parsedResult);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Fel vid uppskapande av kund.' });
    }
  })

  // get entire customer
  .get('/:id', async (req, res) => {
    const customerId = req.params.id;
    const { userId, isAdmin } = req.user;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Ogiltigt kund-ID.' });
    }

    try {
      const result = await Customer.findById(customerId);
      if (!isAdmin && userId != result.advisor) {
        return res.status(403).json({ error: 'Obehörig åtkomst till vald kund.' });
      }

      res.status(200).send(result);
    } catch (err) {
      res.status(err.status).json({ error: 'Fel vid inläsning av kund.' });
    }
  })

  // get field from customer
  .get('/:id/:field/:subField?', async (req, res) => {
    const customerId = req.params.id;
    const fieldName = req.params.field;
    const subField = req.params.subField;
    const { userId, isAdmin } = req.user;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Ogiltigt kund-ID.' });
    }

    try {
      const customerField = await Customer.findById(customerId, { [fieldName]: 1, ['advisor']: 1 });

      if (!customerField) return res.status(404).json({ error: 'Kunde inte hitta kund.' });
      if (!isAdmin && userId != customerField.advisor) {
        return res.status(403).json({ error: 'Obehörig åtkomst till kund.' });
      }
      if (subField) {
        res.status(200).send(customerField[fieldName][subField]);
      } else {
        res.status(200).send(customerField[fieldName]);
      }
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ error: err.message || 'Fel inträffade vi hämtning av kund.' });
    }
  })

  //@ Update specific field
  .patch('/:id/update/:field/:subField?', async (req, res) => {
    const customerId = req.params.id;
    const field = req.params.field;
    const subField = req.params.subField;
    const { userId, isAdmin } = req.user;
    const newData = Object.values(req.body);
    console.log('newData', newData);

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Ogiltigt kund-ID.' });
    }

    try {
      const existingCustomer = await Customer.findById(customerId, { ['advisor']: 1 });

      if (!isAdmin && userId != existingCustomer.advisor) {
        return res.status(403).json({ error: 'Obehörig åtkomst till vald kund.' });
      }

      const fieldPath = subField ? `${field}.${subField}` : field;
      console.log('fieldPath', fieldPath);
      const updateQuery = { $push: { [fieldPath]: { $each: newData } } };
      console.log('updateQuery', updateQuery);
      const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateQuery, {
        new: true,
      });

      if (!updatedCustomer) {
        return res.status(404).json({ error: 'Kunde inte hitta kund.' });
      }
      if (subField) {
        res.status(200).send(updatedCustomer[field][subField]);
      } else {
        res.status(200).send(updatedCustomer[field]);
      }
    } catch (err) {
      console.log('err.message', err.message);
      res
        .status(err.status || 500)
        .json({ error: err.message || 'Fel vid inmatning av kunddata.' });
    }
  })

  //@ Remove subDocument
  .patch('/:id/remove/:field/:subDoc/:subField?', async (req, res) => {
    const custId = req.params.id;
    const field = req.params.field;
    const subDoc = req.params.subDoc;
    const subField = req.params.subField;
    const dataPath = subField ? `${field}.${subField}` : field;

    try {
      const updateQuery = {
        $pull: { [dataPath]: { _id: subDoc } },
      };
      const result = await Customer.findByIdAndUpdate(custId, updateQuery, { new: true });
      if (!result) {
        return res.status(404).json({ error: 'Hittade inte dokumentet.' });
      }

      if (subField) {
        res.status(200).send(result[field][subField]);
      } else {
        res.status(200).send(result[field]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  //remove entire customer
  .delete('/:id', async (req, res) => {
    const customerId = req.params.id;
    const { isAdmin, userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ error: 'Ogiltigt kund-ID.' });
    }

    try {
      const existingCustomer = await Customer.findById(customerId, { ['advisor']: 1 });

      if (!isAdmin && userId != existingCustomer.advisor) {
        return res.status(403).json({ error: 'Obehörig åtkomst till vald kund.' });
      }

      const removedCustomer = await Customer.findByIdAndDelete(customerId);

      if (!removedCustomer) return res.status(404).json({ error: 'Kund ej funnen.' });
      res.status(200).send('Kund borttagen.');
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Ett fel inträffade vid borttagning av kund.' });
    }
  });
module.exports = router;
