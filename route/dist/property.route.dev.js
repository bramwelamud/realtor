"use strict";

// routes/propertyRoutes.js
var express = require('express');

var upload = require('../helpers/app.uploader'); // Ensure this path is correct


var _require = require('../controllers/property.controller'),
    createProperty = _require.createProperty,
    getAllProperties = _require.getAllProperties,
    searchNearbyProperties = _require.searchNearbyProperties,
    updateProperty = _require.updateProperty,
    deleteProperty = _require.deleteProperty;

var router = express.Router();

var _require2 = require('../helpers/app.uploader'),
    doupload = _require2.doupload;

router.get('/queryall_properties', upload.doUploadPhotos, getAllProperties);
router.post('/create_property', createProperty);
router.get('/search', searchNearbyProperties);
router.put('/update:id', updateProperty);
router["delete"]('/delete:id', deleteProperty);
module.exports = router;