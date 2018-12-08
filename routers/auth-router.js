'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {User} = require('../models');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');
const authRouter = express.Router();

authRouter.use(bodyParser.json());

const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = function(req, res, next) {
  User.findOne({ username: req.body.username })
  .then(_user => {
    let user;
    user = _user;
    if (!user) {
      return Promise.reject({});
    }
    //req.body._id = user._id
    return user.validatePassword(req.body.password);
  })
  .then(isValid => {
    if (!isValid) {
      return Promise.reject({});
    }
    next();
	})
  .catch(err => {
    res.status(400).send("Incorrect username or password");
  })		
};

 
// The user provides a username and password to login and receives a JWT token in response
authRouter.post('/', localAuth, (req, res) => {
  const authToken = createAuthToken(req.body);
  res.status(201).json({authToken, username: req.body.username});
});

module.exports = authRouter;
