const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

function normalizeContactPayload(payload) {
  return {
    name: typeof payload.name === 'string' ? payload.name.trim() : '',
    company: typeof payload.company === 'string' ? payload.company.trim() : '',
    email: typeof payload.email === 'string' ? payload.email.trim() : null,
    phone: typeof payload.phone === 'string' ? payload.phone.trim() : null,
    owner: typeof payload.owner === 'string' && payload.owner.trim() ? payload.owner.trim() : 'Ana'
  };
}

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = normalizeContactPayload(req.body);
    if (!data.name || !data.company) {
      return res.status(400).json({ error: 'Name and Company are required' });
    }

    const newContact = await Contact.create(data);
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const data = normalizeContactPayload({ ...contact.toJSON(), ...req.body });
    if (!data.name || !data.company) {
      return res.status(400).json({ error: 'Name and Company are required' });
    }

    await contact.update(data);
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Contact.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
