"use strict";

// models/Survey.js
var _require = require('sequelize'),
    DataTypes = _require.DataTypes;

var sequelize = require('../config/db.connect');

var Survey = sequelize.define('Survey', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      // Use the name of your User model's table
      key: 'id'
    }
  },
  preferences: {
    type: DataTypes.JSON,
    // Store preferences in JSON format
    allowNull: false
  }
}, {
  timestamps: true
});
module.exports = Survey;