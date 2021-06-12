const express = require('express');
const router = require('express-promise-router')();

const UserController = require('../controllers/user');

router.route('/signin').post(UserController.signIn);

router.route('/signup').post(UserController.signUp);

router.route('/secret').get(UserController.secret);


module.exports = router