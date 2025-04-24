const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Staff = require('../models/Staff');
const router = express.Router();
const fs = require('fs'); // För att radera filer

// Spara uppladdade filer i "images/" mappen
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'images/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // godkänd
        } else {
            cb(new Error('Endast JPEG, PNG och WebP tillåts'), false); // nekad
        }
    }
});

// Skapa personal
router.post('/', (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError || err?.message) {
            return res.status(400).json({ error: err.message });
        }
        next(); // fortsätt till nedanstående kod
    });
}, async (req, res) => {
    try {
        // Fullständig URL till bilden
        const imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;

        const staff = new Staff({
            name: req.body.name,
            email: req.body.email,
            image: imageUrl
        });
        await staff.save();
        res.status(201).json(staff);
    } catch (err) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Fel vid radering av fil:', err);
            });
        }
        if (err.code === 11000) {
            return res.status(400).json({ error: `E-postadressen ${req.body.email} finns redan registrerad.` });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Samtliga fält är obligatoriska: name, email, image' });
        }
        res.status(400).json({ error: err.message });
    }
});


// Hämta alla
router.get('/', async (req, res) => {
    const staff = await Staff.find();
    res.json(staff);
});

// Hämta en person
router.get('/:id', async (req, res) => {
    try {
        const person = await Staff.findById(req.params.id);
        if (!person) return res.status(404).json({ error: 'Hittades ej' });
        res.json(person);
    } catch {
        res.status(400).json({ error: 'Felaktigt ID' });
    }
});

// Ta bort personal
router.delete('/:id', async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.json({ message: 'Raderad' });
    } catch {
        res.status(400).json({ error: 'Fel vid radering' });
    }
});

module.exports = router;
