const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicantRoutes = require('./routes/applicantRoutes');

const port = process.env.port || 3000;

const app = express();

app.use(morgan('dev'));
app.use(cors()); // Allow access from any domain
app.use(express.json());

const uri = 'mongodb+srv://niteshnagar1142002:WqmYZATrn2H8P6qm@cluster0.h7rsur3.mongodb.net/whatsapp';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/user', userRoutes);
app.use('/job', jobRoutes);
app.use('/applicant', applicantRoutes);
app.get('*', (req, res) => {
    res.status(404).send({ status: 404, success: false, msg: 'Route not found' });
});

app.listen(port, () => console.log(`Application Running On http://127.0.0.1:${port}/`));
