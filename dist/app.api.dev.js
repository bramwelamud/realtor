'use strict';

var express = require('express');

var path = require('path');

var dotenv = require('dotenv');

var cors = require('cors');

var fileUpload = require('express-fileupload');

var sequelize = require('./config/db.connect'); // Load environment variables from .env file


dotenv.config();
var app = express();
var API_port = process.env.PORT_API || 4000; // Use port from environment or default to 4000

var API_VERSION = process.env.API_VERSION || 'v1'; // Fallback version if not set in .env
// CORS configuration (allow all origins in development; adjust in production)

var corsOpt = {
  origin: '*',
  // Adjust in production
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'api_key']
}; // Middleware

app.use(cors(corsOpt));
app.options('*', cors(corsOpt)); // Enable pre-flight requests for all routes

app.use(express.json()); // Parse JSON request bodies

app.use(express.urlencoded({
  extended: true
})); // Parse URL-encoded request bodies
// Database synchronization

sequelize.sync({
  force: false
}).then(function () {
  return console.log('Database synced');
})["catch"](function (err) {
  console.error('Error syncing database:', err);
  process.exit(1); // Exit on sync error
}); // Set up file uploads

app.use(express["static"](path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/' // Ensure this directory exists or adjust as necessary

})); // Import routes

var usersRoutes = require('./route/user.route');

var photosRoutes = require('./route/photo.route');

var propertiesRoutes = require('./route/property.route');

var matchesRoutes = require('./route/matche.route');

var searchproperty = require('./route/search.route');

var surveyRoutes = require('./route/survey.route'); // Use routes under /api


app.use('/api/users', usersRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/photos', photosRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/search', searchproperty); // Error handling middleware

app.use(function (err, req, res, next) {
  console.error('Error stack:', err.stack); // Log the error stack trace

  res.status(500).send({
    message: 'Internal Server Error',
    error: err.message
  });
}); // Basic health check route

app.get("/", function (req, res) {
  res.json({
    message: "WA API version " + API_VERSION
  });
}); // Start the server with error handling for port conflicts

var server = app.listen(API_port, function () {
  console.log("Server is running at http://localhost:".concat(API_port));
  console.log("Realtor_RA145 API Version: ".concat(API_VERSION));
}); // Handle server errors, like address already in use

server.on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    console.error("Port ".concat(API_port, " is already in use. Please free the port or choose another."));
    process.exit(1); // Exit the process to avoid hanging
  } else {
    console.error('Server error:', err);
  }
});