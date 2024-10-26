// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect'); // Ensure correct path to db.connect
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Email format validation
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('applicant', 'realtor', 'landlord'),
        allowNull: false,
    },
    membership_tier: {
        type: DataTypes.ENUM('bronze', 'silver', 'gold'),
        defaultValue: 'bronze',
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    work_email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true, // Email format validation
        },
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordTokenExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

// Hash the password before saving the user
User.beforeCreate(async (user) => {
    const saltRounds = 10; // You can adjust this value for security
    user.password = await bcrypt.hash(user.password, saltRounds);
});

// Export the User model without associations
module.exports = User;
