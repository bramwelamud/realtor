'use strict';

var fs = require('fs');

var path = require('path');

var multer = require('multer');

var sharp = require("sharp");

var dotenv = require('dotenv').config();

var Properties = require('../models/properties.model'); // Import Properties model


var df = require('../uploads/');

var pathUploadFolder = process.env.APP_UPLOAD_PATH || df; // Ensure upload directory exists

if (!fs.existsSync(pathUploadFolder)) {
  fs.mkdirSync(pathUploadFolder, {
    recursive: true
  });
} // Set up multer storage configuration


var storage = multer.diskStorage({
  destination: function destination(req, file, callback) {
    callback(null, pathUploadFolder);
  },
  filename: function filename(req, file, callback) {
    var extArray = file.mimetype.split("/");
    var extension = extArray[extArray.length - 1];
    callback(null, file.fieldname + '-' + Date.now() + '.' + extension);
  }
});
var upload = multer({
  storage: storage
}).array('photos_property', 10); // Upload multiple photos
// Function to handle the photo upload process

exports.doUploadPhotos = function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          upload(req, res, function _callee(err) {
            var property_id, category_id, photos, groupPhotos, imgCounter, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, photo, insertPhoto, extArray, extension, name, uploadPath, fileThumbnail, uploadPathThumbnail, fileSlide, uploadPathSlide, photoMultipleInsert;

            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!err) {
                      _context.next = 2;
                      break;
                    }

                    return _context.abrupt("return", res.status(500).json({
                      msg: 'Error uploading photos',
                      err: err
                    }));

                  case 2:
                    if (!(!req.files || req.files.length === 0)) {
                      _context.next = 4;
                      break;
                    }

                    return _context.abrupt("return", res.status(400).json({
                      msg: 'No photos uploaded'
                    }));

                  case 4:
                    property_id = req.params.propertyId;
                    category_id = req.params.categoryId; // Validate property and category IDs

                    if (!(!property_id || !category_id)) {
                      _context.next = 8;
                      break;
                    }

                    return _context.abrupt("return", res.status(400).json({
                      msg: 'Property ID and Category ID are required'
                    }));

                  case 8:
                    photos = req.files;
                    groupPhotos = [], imgCounter = 1;
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 13;
                    _iterator = photos[Symbol.iterator]();

                  case 15:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                      _context.next = 47;
                      break;
                    }

                    photo = _step.value;
                    insertPhoto = {
                      property_id: property_id,
                      file_size: photo.size,
                      file_mime_type: photo.mimetype
                    };
                    extArray = photo.mimetype.split("/");
                    extension = extArray[extArray.length - 1];
                    name = "photo_property-".concat(imgCounter, "-").concat(Date.now(), ".").concat(extension);
                    uploadPath = path.join(pathUploadFolder, name);
                    insertPhoto.file_name = name;
                    insertPhoto.file_location = uploadPath;
                    fileThumbnail = "thumbnail_".concat(name);
                    uploadPathThumbnail = path.join(pathUploadFolder, fileThumbnail);
                    fileSlide = "slide_".concat(name);
                    uploadPathSlide = path.join(pathUploadFolder, fileSlide);
                    imgCounter++;
                    photoMultipleInsert = [property_id, insertPhoto.file_size, insertPhoto.file_mime_type, insertPhoto.file_name, insertPhoto.file_location, fileThumbnail, fileSlide, category_id];
                    groupPhotos.push(photoMultipleInsert);
                    _context.prev = 31;
                    _context.next = 34;
                    return regeneratorRuntime.awrap(fs.promises.rename(photo.path, uploadPath));

                  case 34:
                    _context.next = 36;
                    return regeneratorRuntime.awrap(sharp(uploadPath).resize(640, 320).toFile(uploadPathThumbnail));

                  case 36:
                    _context.next = 38;
                    return regeneratorRuntime.awrap(sharp(uploadPath).resize(1200, 779).toFile(uploadPathSlide));

                  case 38:
                    _context.next = 44;
                    break;

                  case 40:
                    _context.prev = 40;
                    _context.t0 = _context["catch"](31);
                    console.error('Error processing photo:', _context.t0);
                    return _context.abrupt("return", res.status(500).json({
                      msg: 'Error processing photo',
                      err: _context.t0
                    }));

                  case 44:
                    _iteratorNormalCompletion = true;
                    _context.next = 15;
                    break;

                  case 47:
                    _context.next = 53;
                    break;

                  case 49:
                    _context.prev = 49;
                    _context.t1 = _context["catch"](13);
                    _didIteratorError = true;
                    _iteratorError = _context.t1;

                  case 53:
                    _context.prev = 53;
                    _context.prev = 54;

                    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                      _iterator["return"]();
                    }

                  case 56:
                    _context.prev = 56;

                    if (!_didIteratorError) {
                      _context.next = 59;
                      break;
                    }

                    throw _iteratorError;

                  case 59:
                    return _context.finish(56);

                  case 60:
                    return _context.finish(53);

                  case 61:
                    // Insert the photo data into the database
                    Properties.photoUploadMultipleProperty(groupPhotos, function (err, items) {
                      if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({
                          msg: 'Error saving photos',
                          err: err
                        });
                      }

                      return res.status(200).json({
                        msg: 'Photos uploaded successfully',
                        data: items
                      });
                    });

                  case 62:
                  case "end":
                    return _context.stop();
                }
              }
            }, null, null, [[13, 49, 53, 61], [31, 40], [54,, 56, 60]]);
          });
          _context2.next = 8;
          break;

        case 4:
          _context2.prev = 4;
          _context2.t0 = _context2["catch"](0);
          console.error('Server error:', _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            msg: 'Server error',
            error: _context2.t0
          }));

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 4]]);
}; // Function to handle photo removal


exports.removeFiles = function _callee3(req, res) {
  var regId;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          regId = req.params.id;
          Properties.photoRemoveFile(regId, function (err, items) {
            if (err) {
              console.error('Error fetching item for regId:', regId, err);
              return res.status(500).send('Error occurred during fetching item for regId ' + regId);
            }

            try {
              // Check if items data exists
              if (items.data) {
                if (items.data.file_name) fs.unlinkSync(path.join(pathUploadFolder, items.data.file_name));
                if (items.data.file_thumbnail) fs.unlinkSync(path.join(pathUploadFolder, items.data.file_thumbnail));
                if (items.data.file_slider) fs.unlinkSync(path.join(pathUploadFolder, items.data.file_slider));
              }

              return res.send({
                status: 'ok',
                message: 'File is removed.',
                item: items
              });
            } catch (error) {
              console.error('Error during file removal:', error);
              return res.status(500).send('Error occurred while removing file for regId ' + regId);
            }
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};