// controllers/PropertyController.js
const { Property } = require('../models/properties.model');
const { Op } = require('sequelize');
const  doUploadPhotos  = require('../helpers/app.uploader'); // Adjust the import if necessary

// Create a new property
const createProperty = async (req, res) => {
    const {
        address, city, state, zip_code, bedrooms, bathrooms, price,
        amenities, description, year_built, square_feet, lot_size, property_type
    } = req.body;

    try {
        // Handle file upload
        let image_urls = [];
        if (req.files) {
            const uploadResponse = await new Promise((resolve, reject) => {
                doUploadPhotos(req, res, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(req.files);
                });
            });

            // Assuming image URLs are returned from the upload response
            image_urls = uploadResponse.map(file => file.file_location); // Adjust according to your uploader logic
        }

        const newProperty = await Property.create({
            address, city, state, zip_code, bedrooms, bathrooms, price, image_urls, 
            amenities, description, year_built, square_feet, lot_size, property_type
        });

        res.status(201).json(newProperty);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all properties with optional filtering
const getAllProperties = async (req, res) => {
    const { city, state, minPrice, maxPrice, bedrooms, bathrooms } = req.query;

    const whereClause = {};
    if (city) whereClause.city = city;
    if (state) whereClause.state = state;
    if (minPrice) whereClause.price = { [Op.gte]: minPrice };
    if (maxPrice) whereClause.price = { [Op.lte]: maxPrice };
    if (bedrooms) whereClause.bedrooms = { [Op.gte]: bedrooms };
    if (bathrooms) whereClause.bathrooms = { [Op.gte]: bathrooms };

    try {
        const properties = await Property.findAll({ where: whereClause });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get properties within a 5-mile radius of a specific location
const searchNearbyProperties = async (req, res) => {
    const { lat, lng } = req.query; // Assume latitude and longitude are provided
  
    // Placeholder for real implementation (e.g., using a geospatial query)
    try {
        const properties = await Property.findAll(); // Replace with actual geospatial query logic
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a property
const updateProperty = async (req, res) => {
    const { id } = req.params;
    const {
        address, city, state, zip_code, bedrooms, bathrooms, price,
        amenities, description, year_built, square_feet, lot_size, property_type
    } = req.body;

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Handle file upload if files are present in the request
        if (req.files) {
            const uploadResponse = await new Promise((resolve, reject) => {
                doUploadPhotos(req, res, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(req.files);
                });
            });

            const image_urls = uploadResponse.map(file => file.file_location); // Adjust according to your uploader logic
            property.image_urls = image_urls; // Update image URLs in the property
        }

        property.address = address || property.address;
        property.city = city || property.city;
        property.state = state || property.state;
        property.zip_code = zip_code || property.zip_code;
        property.bedrooms = bedrooms || property.bedrooms;
        property.bathrooms = bathrooms || property.bathrooms;
        property.price = price || property.price;
        property.amenities = amenities || property.amenities;
        property.description = description || property.description;
        property.year_built = year_built || property.year_built;
        property.square_feet = square_feet || property.square_feet;
        property.lot_size = lot_size || property.lot_size;
        property.property_type = property_type || property.property_type;

        await property.save();
        res.json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a property
const deleteProperty = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        await property.destroy();
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Export controller methods
module.exports = {
    createProperty,
    getAllProperties,
    searchNearbyProperties,
    updateProperty,
    deleteProperty
};
