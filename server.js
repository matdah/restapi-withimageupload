/**
 * Skal till ett REST-API med Nodejs och Express
 * Av Mattias Dahlgren, mattias.dahlgren@miun.se
 */
const express = require('express');
const cors = require('cors');
const staffRoutes = require('./routes/Staff');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;

// Använd JSON-data i anropen
app.use(express.json());

// Statiska filer
app.use(express.static('public'));
app.use('/images', express.static('images')); // Serva bilder

// Aktivera CORS middleware för alla rutter
app.use(cors());

/** ------ Rutter (Routes) ------ */

// GET /api
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to my REST API' });
});

// GET /api/staff
app.use('/api/staff', staffRoutes);

// Om ingen av ovanstående rutter fångar upp anropet
app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Starta servern
// 🧠 Anslut till MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION)
    .then(() => {
        console.log('✅ Ansluten till MongoDB');
        app.listen(port, () => console.log('🚀 Servern kör på http://localhost:' + port));
    })
    .catch(err => console.error('❌ Fel vid MongoDB-anslutning:', err));