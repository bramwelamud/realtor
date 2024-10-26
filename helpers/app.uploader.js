'use strict';
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require("sharp");
const dotenv = require('dotenv').config();
const Properties = require('../models/properties.model'); // Import Properties model

const pathUploadFolder = process.env.APP_UPLOAD_PATH || './uploads/';

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, pathUploadFolder);
    },
    filename: (req, file, callback) => {
        const extArray = file.mimetype.split("/");
        const extension = extArray[extArray.length - 1];
        callback(null, file.fieldname + '-' + Date.now() + '.' + extension);
    }
});

const upload = multer({ storage }).array('photos_property', 10); // Upload multiple photos

// Function to handle the photo upload process
 module.exports.doUploadPhotos = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ msg: 'Error uploading photos', err });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ msg: 'No photos uploaded' });
            }

            const property_id = req.params.propertyId;
            const category_id = req.params.categoryId;
            const photos = req.files;
            let groupPhotos = [], imgCounter = 1;

            for (const photo of photos) {
                const insertPhoto = {
                    property_id: property_id,
                    file_size: photo.size,
                    file_mime_type: photo.mimetype
                };

                const extArray = photo.mimetype.split("/");
                const extension = extArray[extArray.length - 1];
                const name = `photo_property-${imgCounter}-${Date.now()}.${extension}`;
                const uploadPath = path.join(pathUploadFolder, name);

                insertPhoto.file_name = name;
                insertPhoto.file_location = uploadPath;
                const fileThumbnail = `thumbnail_${name}`;
                const uploadPathThumbnail = path.join(pathUploadFolder, fileThumbnail);
                const fileSlide = `slide_${name}`;
                const uploadPathSlide = path.join(pathUploadFolder, fileSlide);
                imgCounter++;

                const photoMultipleInsert = [
                    property_id,
                    insertPhoto.file_size,
                    insertPhoto.file_mime_type,
                    insertPhoto.file_name,
                    insertPhoto.file_location,
                    fileThumbnail,
                    fileSlide,
                    category_id
                ];

                groupPhotos.push(photoMultipleInsert);

                try {
                    // Move the file and generate thumbnails
                    await fs.promises.rename(photo.path, uploadPath);
                    await sharp(uploadPath).resize(640, 320).toFile(uploadPathThumbnail);
                    await sharp(uploadPath).resize(1200, 779).toFile(uploadPathSlide);
                } catch (err) {
                    console.error('Error processing photo:', err);
                    return res.status(500).json({ msg: 'Error processing photo', err });
                }
            }

            // Insert the photo data into the database
            Properties.photoUploadMultipleProperty(groupPhotos, function (err, items) {
                if (err) {
                    return res.status(500).json({ msg: 'Error saving photos', err });
                }
                return res.status(200).json({ msg: 'Photos uploaded successfully', data: items });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ msg: 'Server error', error });
    }
};

exports.removeFiles = async (req, res) => {
    const regId = req.params.id;
    Properties.photoRemoveFile(regId, function (err, items) {
        if (err) return res.status(500).send('Error occurred during fetching item for regId ' + regId);

        try {
            fs.unlinkSync(path.join(pathUploadFolder, items.data.file_name));
            fs.unlinkSync(path.join(pathUploadFolder, items.data.file_thumbnail));
            fs.unlinkSync(path.join(pathUploadFolder, items.data.file_slider));
            return res.send({ status: 'ok', message: 'File is removed.', item: items });
        } catch (error) {
            console.error('Error during file removal:', error);
            return res.status(500).send('Error occurred while removing file for regId ' + regId);
        }
    });
};
