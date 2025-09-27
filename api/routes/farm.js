const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const auth = require('../middlewares/auth')();

router.post('/', auth, async (req, res) => {
  const owner = req.user._id;
  const farm = await Farm.create({ owner, ...req.body });
  res.status(201).json(farm);
});

router.get('/:id', auth, async (req, res) => {
  const farm = await Farm.findById(req.params.id);
  if (!farm) return res.status(404).json({ message: 'not found' });
  res.json(farm);
});

module.exports = router;
