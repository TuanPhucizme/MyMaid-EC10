// server/routes/serviceRoutes.js

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const servicesRef = db.collection('mm_services');
    const snapshot = await servicesRef.get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const servicesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(servicesList);

  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { id, name_service, description, icon, pricingTiers } = req.body;

    // Server-side validation
    if (!id || !name_service || !pricingTiers) {
      return res.status(400).send({ message: 'Service ID, name, and pricing tiers are required.' });
    }
    if (!Array.isArray(pricingTiers) || pricingTiers.length === 0) {
      return res.status(400).send({ message: 'Pricing tiers must be a non-empty array.' });
    }

    const serviceDocRef = db.collection('mm_services').doc(id);
    const doc = await serviceDocRef.get();
    if (doc.exists) {
      return res.status(409).send({ message: 'Service with this ID already exists.' });
    }

    const newService = {
      id,
      name_service,
      description: description || "",
      icon: icon || "",
      pricingTiers: pricingTiers, // Lưu mảng bậc giá
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await serviceDocRef.set(newService);
    res.status(201).json({ message: 'Service created successfully!', data: newService });

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


router.put('/:serviceId', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name_service, description, icon, pricingTiers } = req.body;

    const serviceDocRef = db.collection('mm_services').doc(serviceId);
    const doc = await serviceDocRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Service not found.' });
    }

    const dataToUpdate = {};
    if (name_service) dataToUpdate.name_service = name_service;
    if (description !== undefined) dataToUpdate.description = description;
    if (icon !== undefined) dataToUpdate.icon = icon;

    // Nếu có gửi mảng pricingTiers, cập nhật nó
    if (pricingTiers) {
      if (!Array.isArray(pricingTiers) || pricingTiers.length === 0) {
        return res.status(400).send({ message: 'Pricing tiers must be a non-empty array.' });
      }
      dataToUpdate.pricingTiers = pricingTiers;
    }
    
    dataToUpdate.updatedAt = new Date(); // Thêm trường này để biết lần cập nhật cuối

    await serviceDocRef.update(dataToUpdate);
    res.status(200).send({ message: 'Service updated successfully!' });

  } catch (error) {
    console.error(`Error updating service ${req.params.serviceId}:`, error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.delete('/:serviceId', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { serviceId } = req.params;
        const serviceDocRef = db.collection('mm_services').doc(serviceId);
        const doc = await serviceDocRef.get();

        if (!doc.exists) {
            return res.status(404).send({ message: 'Service not found.' });
        }

        await serviceDocRef.delete();

        res.status(200).send({ message: 'Service deleted successfully!' });

    } catch (error) {
        console.error(`Error deleting service ${req.params.serviceId}:`, error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

module.exports = router;