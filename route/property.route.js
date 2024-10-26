// routes/propertyRoutes.js
const express = require('express');
const upload = require('../helpers/app.uploader'); // Ensure this path is correct
const { createProperty, getAllProperties, searchNearbyProperties, updateProperty, deleteProperty } = require('../controllers/property.controller');
const router = express.Router();
const {doupload} = require('../helpers/app.uploader')



router.get('/queryall_properties', upload.doUploadPhotos,getAllProperties);
router.post('/create_property', createProperty);
router.get('/search', searchNearbyProperties);
router.put('/update:id', updateProperty);
router.delete('/delete:id', deleteProperty);

module.exports = router;
