"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// controllers/PropertyController.js
var _require = require('../models/properties.model'),
    Property = _require.Property;

var _require2 = require('sequelize'),
    Op = _require2.Op;

var doUploadPhotos = require('../helpers/app.uploader'); // Adjust the import if necessary
// Create a new property


var createProperty = function createProperty(req, res) {
  var _req$body, address, city, state, zip_code, bedrooms, bathrooms, price, amenities, description, year_built, square_feet, lot_size, property_type, image_urls, uploadResponse, newProperty;

  return regeneratorRuntime.async(function createProperty$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, address = _req$body.address, city = _req$body.city, state = _req$body.state, zip_code = _req$body.zip_code, bedrooms = _req$body.bedrooms, bathrooms = _req$body.bathrooms, price = _req$body.price, amenities = _req$body.amenities, description = _req$body.description, year_built = _req$body.year_built, square_feet = _req$body.square_feet, lot_size = _req$body.lot_size, property_type = _req$body.property_type;
          _context.prev = 1;
          // Handle file upload
          image_urls = [];

          if (!req.files) {
            _context.next = 8;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            doUploadPhotos(req, res, function (err) {
              if (err) {
                return reject(err);
              }

              resolve(req.files);
            });
          }));

        case 6:
          uploadResponse = _context.sent;
          // Assuming image URLs are returned from the upload response
          image_urls = uploadResponse.map(function (file) {
            return file.file_location;
          }); // Adjust according to your uploader logic

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(Property.create({
            address: address,
            city: city,
            state: state,
            zip_code: zip_code,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            price: price,
            image_urls: image_urls,
            amenities: amenities,
            description: description,
            year_built: year_built,
            square_feet: square_feet,
            lot_size: lot_size,
            property_type: property_type
          }));

        case 10:
          newProperty = _context.sent;
          res.status(201).json(newProperty);
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context.t0
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 14]]);
}; // Get all properties with optional filtering


var getAllProperties = function getAllProperties(req, res) {
  var _req$query, city, state, minPrice, maxPrice, bedrooms, bathrooms, whereClause, properties;

  return regeneratorRuntime.async(function getAllProperties$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$query = req.query, city = _req$query.city, state = _req$query.state, minPrice = _req$query.minPrice, maxPrice = _req$query.maxPrice, bedrooms = _req$query.bedrooms, bathrooms = _req$query.bathrooms;
          whereClause = {};
          if (city) whereClause.city = city;
          if (state) whereClause.state = state;
          if (minPrice) whereClause.price = _defineProperty({}, Op.gte, minPrice);
          if (maxPrice) whereClause.price = _defineProperty({}, Op.lte, maxPrice);
          if (bedrooms) whereClause.bedrooms = _defineProperty({}, Op.gte, bedrooms);
          if (bathrooms) whereClause.bathrooms = _defineProperty({}, Op.gte, bathrooms);
          _context2.prev = 8;
          _context2.next = 11;
          return regeneratorRuntime.awrap(Property.findAll({
            where: whereClause
          }));

        case 11:
          properties = _context2.sent;
          res.json(properties);
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](8);
          res.status(500).json({
            message: 'Server error',
            error: _context2.t0
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 15]]);
}; // Get properties within a 5-mile radius of a specific location


var searchNearbyProperties = function searchNearbyProperties(req, res) {
  var _req$query2, lat, lng, properties;

  return regeneratorRuntime.async(function searchNearbyProperties$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$query2 = req.query, lat = _req$query2.lat, lng = _req$query2.lng; // Assume latitude and longitude are provided
          // Placeholder for real implementation (e.g., using a geospatial query)

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Property.findAll());

        case 4:
          properties = _context3.sent;
          // Replace with actual geospatial query logic
          res.json(properties);
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context3.t0
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Update a property


var updateProperty = function updateProperty(req, res) {
  var id, _req$body2, address, city, state, zip_code, bedrooms, bathrooms, price, amenities, description, year_built, square_feet, lot_size, property_type, property, uploadResponse, image_urls;

  return regeneratorRuntime.async(function updateProperty$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, address = _req$body2.address, city = _req$body2.city, state = _req$body2.state, zip_code = _req$body2.zip_code, bedrooms = _req$body2.bedrooms, bathrooms = _req$body2.bathrooms, price = _req$body2.price, amenities = _req$body2.amenities, description = _req$body2.description, year_built = _req$body2.year_built, square_feet = _req$body2.square_feet, lot_size = _req$body2.lot_size, property_type = _req$body2.property_type;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Property.findByPk(id));

        case 5:
          property = _context4.sent;

          if (property) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'Property not found'
          }));

        case 8:
          if (!req.files) {
            _context4.next = 14;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            doUploadPhotos(req, res, function (err) {
              if (err) {
                return reject(err);
              }

              resolve(req.files);
            });
          }));

        case 11:
          uploadResponse = _context4.sent;
          image_urls = uploadResponse.map(function (file) {
            return file.file_location;
          }); // Adjust according to your uploader logic

          property.image_urls = image_urls; // Update image URLs in the property

        case 14:
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
          _context4.next = 29;
          return regeneratorRuntime.awrap(property.save());

        case 29:
          res.json(property);
          _context4.next = 35;
          break;

        case 32:
          _context4.prev = 32;
          _context4.t0 = _context4["catch"](2);
          res.status(500).json({
            message: 'Server error',
            error: _context4.t0
          });

        case 35:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 32]]);
}; // Delete a property


var deleteProperty = function deleteProperty(req, res) {
  var id, property;
  return regeneratorRuntime.async(function deleteProperty$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Property.findByPk(id));

        case 4:
          property = _context5.sent;

          if (property) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Property not found'
          }));

        case 7:
          _context5.next = 9;
          return regeneratorRuntime.awrap(property.destroy());

        case 9:
          res.json({
            message: 'Property deleted successfully'
          });
          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context5.t0
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 12]]);
}; // Export controller methods


module.exports = {
  createProperty: createProperty,
  getAllProperties: getAllProperties,
  searchNearbyProperties: searchNearbyProperties,
  updateProperty: updateProperty,
  deleteProperty: deleteProperty
};