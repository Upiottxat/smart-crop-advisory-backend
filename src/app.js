require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const farmRoutes = require('./routes/farm');
const soilRoutes = require('./routes/soil');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/farms', farmRoutes);
app.use('/api/v1/soil', soilRoutes);

app.get('/', (req, res) => res.json({ ok: true, name: 'smart-crop-advisory-backend' }));

async function start(){
  await mongoose.connect(process.env.MONGO_URI, { });
  console.log('Mongo connected');
  app.listen(PORT, ()=> console.log('Server running on', PORT));
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});

module.exports = app;
