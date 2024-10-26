"use strict";

// models/User.js
var _require = require('sequelize'),
    DataTypes = _require.DataTypes;

var sequelize = require('../config/db.connect'); // Ensure correct path to db.connect


var bcrypt = require('bcrypt'); // Import bcrypt for password hashing


var User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Email format validation

    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('applicant', 'realtor', 'landlord'),
    allowNull: false
  },
  membership_tier: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold'),
    defaultValue: 'bronze'
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true
  },
  work_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true // Email format validation

    }
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordTokenExpiration: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
}); // Hash the password before saving the user

User.beforeCreate(function _callee(user) {
  var saltRounds;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          saltRounds = 10; // You can adjust this value for security

          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(user.password, saltRounds));

        case 3:
          user.password = _context.sent;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Export the User model without associations

module.exports = User;