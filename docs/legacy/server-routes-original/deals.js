const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

const VALID_STAGES = new Set(['qualificacao', 'demonstracao', 'proposta', 'negociacao', 'ganho', 'perdido']);

function normalizeDealPayload(payload) {
  const parsedValue = Number(payload.value);
  return {
    title: typeof payload.title === 'string' ? payload.title.trim() : '',
    value: Number.isFinite(parsedValue) ? parsedValue : NaN,
    stage: typeof payload.stage === 'string' && payload.stage.trim() ? payload.stage.trim() : 'qualificacao',
    owner: typeof payload.owner === 'string' && payload.owner.trim() ? payload.owner.trim() : 'Ana',
    company: typeof payload.company === 'string' ? payload.company.trim() : ''
  };
}

function validateDeal(data) {
  if (!data.title || !Number.isFinite(data.value)) return 'Title and Value are required';
  if (data.value < 0) return 'Value must be greater than or equal to zero';
  if (!VALID_STAGES.has(data.stage)) return 'Invalid stage';
  return null;
}

router.get('/', async (req, res) => {
  try {
    const deals = await Deal.findAll({ order: [['createdAt', 'DESC']] });
    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = normalizeDealPayload(req.body);
    const validationError = validateDeal(data);
    if (validationError) return res.status(400).json({ error: validationError });

    const newDeal = await Deal.create(data);
    res.status(201).json(newDeal);
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);
    if (!deal) return res.status(404).json({ error: 'Deal not found' });

    const data = normalizeDealPayload({ ...deal.toJSON(), ...req.body });
    const validationError = validateDeal(data);
    if (validationError) return res.status(400).json({ error: validationError });

    await deal.update(data);
    res.json(deal);
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Deal.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Deal not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
