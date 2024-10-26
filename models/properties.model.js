// models/Survey.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect');

const Survey = sequelize.define('Survey', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Use the name of your User model's table
            key: 'id',
        },
    },
    preferences: {
        type: DataTypes.JSON, // Store preferences in JSON format
        allowNull: false,
    },
}, {
    timestamps: true,
});

module.exports = Survey;
