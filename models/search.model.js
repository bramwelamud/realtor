const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect');
const User = require('../models/user.model');
const Property = require('../models/properties.model');

const Search = sequelize.define('Search', {
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
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0, // Minimum price cannot be negative
        },
    },
    maxPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            isGreaterThanMinPrice(value) {
                if (this.minPrice && value < this.minPrice) {
                    throw new Error('Max price must be greater than min price');
                }
            },
        },
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
        },
    },
    bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
        },
    },
    propertyType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Set up associations
User.hasMany(Search, { foreignKey: 'userId' });
Search.belongsTo(User, { foreignKey: 'userId' });

// Example of a method to find searches within a price range
Search.getByPriceRange = async function (minPrice, maxPrice) {
    return await Search.findAll({
        where: {
            minPrice: { [sequelize.Op.gte]: minPrice },
            maxPrice: { [sequelize.Op.lte]: maxPrice },
        },
    });
};

// Optional: Indexes for optimized querying
Search.addIndex('userId'); // Optimize searches by user

module.exports = Search;
