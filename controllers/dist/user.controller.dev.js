"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv').config();

var _require = require('../models/user.model'),
    User = _require.User;

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var _require2 = require('express-validator'),
    validationResult = _require2.validationResult;

var nodemailer = require('nodemailer');

var crypto = require('crypto');

var _require3 = require('sequelize'),
    Op = _require3.Op; // For token expiration query


var JWT_SECRET = process.env.JWT_SECRET;
var EMAIL_USER = process.env.EMAIL_USER;
var EMAIL_PASS = process.env.EMAIL_PASS;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
}); // Register a new user

var register = function register(req, res) {
  var errors, _req$body, name, email, password, phone_number, work_email, role, existingUser, hashedPassword, newUser, token;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            errors: errors.array()
          }));

        case 3:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, phone_number = _req$body.phone_number, work_email = _req$body.work_email, role = _req$body.role;
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 7:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'User already exists'
          }));

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 12:
          hashedPassword = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(User.create({
            name: name,
            email: email,
            password: hashedPassword,
            phone_number: phone_number,
            work_email: work_email,
            role: role
          }));

        case 15:
          newUser = _context.sent;
          token = jwt.sign({
            id: newUser.id
          }, JWT_SECRET, {
            expiresIn: '1h'
          });
          res.status(201).json({
            token: token,
            user: newUser
          });
          _context.next = 23;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](4);
          res.status(500).json({
            message: 'Server error',
            error: _context.t0
          });

        case 23:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 20]]);
}; // Login user


var login = function login(req, res) {
  var _req$body2, email, password, user, isMatch, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Invalid credentials'
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: 'Invalid credentials'
          }));

        case 12:
          token = jwt.sign({
            id: user.id
          }, JWT_SECRET, {
            expiresIn: '1h'
          });
          res.json({
            token: token,
            user: user
          });
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context2.t0
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 16]]);
}; // Get user profile


var getProfile = function getProfile(req, res) {
  var user;
  return regeneratorRuntime.async(function getProfile$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findByPk(req.user.id));

        case 3:
          user = _context3.sent;

          if (user) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 6:
          res.json(user);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: 'Server error',
            error: _context3.t0
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Update user profile


var updateProfile = function updateProfile(req, res) {
  var _req$body3, name, phone_number, work_email, user;

  return regeneratorRuntime.async(function updateProfile$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, name = _req$body3.name, phone_number = _req$body3.phone_number, work_email = _req$body3.work_email;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findByPk(req.user.id));

        case 4:
          user = _context4.sent;

          if (user) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 7:
          user.name = name || user.name;
          user.phone_number = phone_number || user.phone_number;
          user.work_email = work_email || user.work_email;
          _context4.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          res.json(user);
          _context4.next = 18;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context4.t0
          });

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 15]]);
}; // Delete user account


var deleteAccount = function deleteAccount(req, res) {
  var user;
  return regeneratorRuntime.async(function deleteAccount$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findByPk(req.user.id));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 6:
          _context5.next = 8;
          return regeneratorRuntime.awrap(user.destroy());

        case 8:
          res.json({
            message: 'Account deleted successfully'
          });
          _context5.next = 14;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: 'Server error',
            error: _context5.t0
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Query all users


var getAllUsers = function getAllUsers(req, res) {
  var users;
  return regeneratorRuntime.async(function getAllUsers$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(User.findAll());

        case 3:
          users = _context6.sent;
          res.json(users);
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: 'Server error',
            error: _context6.t0
          });

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Update password


var updatePassword = function updatePassword(req, res) {
  var _req$body4, oldPassword, newPassword, user, isMatch;

  return regeneratorRuntime.async(function updatePassword$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body4 = req.body, oldPassword = _req$body4.oldPassword, newPassword = _req$body4.newPassword;
          _context7.prev = 1;
          _context7.next = 4;
          return regeneratorRuntime.awrap(User.findByPk(req.user.id));

        case 4:
          user = _context7.sent;

          if (user) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 7:
          _context7.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(oldPassword, user.password));

        case 9:
          isMatch = _context7.sent;

          if (isMatch) {
            _context7.next = 12;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            message: 'Old password is incorrect'
          }));

        case 12:
          _context7.next = 14;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 14:
          user.password = _context7.sent;
          _context7.next = 17;
          return regeneratorRuntime.awrap(user.save());

        case 17:
          res.json({
            message: 'Password updated successfully'
          });
          _context7.next = 23;
          break;

        case 20:
          _context7.prev = 20;
          _context7.t0 = _context7["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context7.t0
          });

        case 23:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 20]]);
}; // Forgot password


var forgotPassword = function forgotPassword(req, res) {
  var email, user, resetToken, resetLink;
  return regeneratorRuntime.async(function forgotPassword$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          email = req.body.email;
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 4:
          user = _context8.sent;

          if (user) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            message: 'User not found'
          }));

        case 7:
          resetToken = crypto.randomBytes(32).toString('hex');
          user.resetPasswordToken = resetToken;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          _context8.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          resetLink = "http://your-frontend-url/reset-password?token=".concat(resetToken);
          _context8.next = 15;
          return regeneratorRuntime.awrap(transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: "<p>Click <a href=\"".concat(resetLink, "\">here</a> to reset your password.</p>")
          }));

        case 15:
          res.json({
            message: 'Reset link sent to your email'
          });
          _context8.next = 21;
          break;

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context8.t0
          });

        case 21:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 18]]);
}; // Reset password using token


var resetPassword = function resetPassword(req, res) {
  var _req$body5, token, newPassword, user;

  return regeneratorRuntime.async(function resetPassword$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body5 = req.body, token = _req$body5.token, newPassword = _req$body5.newPassword;
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              resetPasswordToken: token,
              resetPasswordExpires: _defineProperty({}, Op.gt, Date.now())
            }
          }));

        case 4:
          user = _context9.sent;

          if (user) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            message: 'Invalid or expired token'
          }));

        case 7:
          _context9.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 9:
          user.password = _context9.sent;
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;
          _context9.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          res.json({
            message: 'Password reset successfully'
          });
          _context9.next = 20;
          break;

        case 17:
          _context9.prev = 17;
          _context9.t0 = _context9["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context9.t0
          });

        case 20:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 17]]);
}; // Export controller methods


module.exports = {
  register: register,
  login: login,
  getProfile: getProfile,
  updateProfile: updateProfile,
  deleteAccount: deleteAccount,
  getAllUsers: getAllUsers,
  updatePassword: updatePassword,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword
};