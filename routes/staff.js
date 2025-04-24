const express = require('express');
const mongoose = require('mongoose');
const Staff = require('../models/Staff');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

// Konfigurera Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Konfigurera Multer för att använda minnet (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Skapa personal
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (req.file) {
            // Kontrollera att filtypen är korrekt
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ error: 'Endast JPEG, PNG och WebP tillåts.' });
            }

            // Ladda upp bilden till Cloudinary från buffer
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: 'staff_images', // valfri mapp på Cloudinary
                public_id: `staff_${Date.now()}`, // unikt ID för att undvika kollisioner
                resource_type: 'auto' // automatisk upptäckt av bildtyp (JPEG, PNG, etc.)
            }, async (error, result) => {
                if (error) {
                    return res.status(500).json({ error: 'Cloudinary uppladdning misslyckades' + ': ' + error.message });
                }

                // Spara bildens URL i databasen
                const imageUrl = result.secure_url;

                const staff = new Staff({
                    name: req.body.name,
                    email: req.body.email,
                    image: imageUrl // Spara Cloudinary-URL:en i databasen
                });

                try {
                    await staff.save();
                    res.status(201).json(staff);
                } catch (err) {
                    res.status(400).json({ error: err.message });
                }
            });

            // Skicka bufferten till Cloudinary
            uploadStream.end(req.file.buffer);
        } else {
            res.status(400).json({ error: 'Ingen bild uppladdad.' });
        }
    } catch (err) {
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
