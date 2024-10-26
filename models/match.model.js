// models/Match.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect');
const User = require('../models/user.model');
const Property = require('../models/properties.model');

const Match = sequelize.define('Match', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    propertyId: {
        type: DataTypes.INTEGER,
        references: {
            model: Property,
            key: 'id',
        },
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('new', 'notified', 'favorited'),
        defaultValue: 'new',
    },
}, {
    timestamps: true,
});

// Set up associations
User.hasMany(Match, { foreignKey: 'userId' });
Match.belongsTo(User, { foreignKey: 'userId' });

Property.hasMany(Match, { foreignKey: 'propertyId' });
Match.belongsTo(Property, { foreignKey: 'propertyId' });

// Add instance methods or custom logic here if needed

module.exports = Match;
