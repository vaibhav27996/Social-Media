const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/add-friendship/:id', passport.checkAuthentication, usersController.add_friend);
router.get('/remove-friendship/:id', passport.checkAuthentication, usersController.remove_friend);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create', usersController.create);

//for forgot password
router.get('/send-otp', usersController.sendOtp);
router.get('/forgot-password', usersController.forgotPassword);

router.post('/send-otp-to-mail',usersController.sendOtpToMail);
router.post('/set-passwordInto-db',usersController.setPasswordIntoDB);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);



module.exports = router;