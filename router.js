const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
const passport = require('passport');

const twitterAuth = passport.authenticate('twitter');
const googleAuth = passport.authenticate('google', { scope: ['profile'] });
const facebookAuth = passport.authenticate('facebook');

const authController = require('./authController');
const lrv = require('./lrvConfig');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const addSocketIdtoSession = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

const validateToken = async (req, res, next) => {
  try {
    const { token } = req.query;
    const valid = await lrv.accessToken.validity(token);
    if (valid.errorCode) {
      res.status(400).json(valid);
    } else {
      next();
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

router.get('/twitter', addSocketIdtoSession, twitterAuth);
router.get('/google', addSocketIdtoSession, googleAuth);
router.get('/facebook', addSocketIdtoSession, facebookAuth);

router.get('/twitter/callback', twitterAuth, authController.twitter);
router.get('/google/callback', googleAuth, authController.google);
router.get('/facebook/callback', facebookAuth, authController.facebook);

router.post('/email', authController.emailLogin);
router.post('/email/signup', authController.emailSignup);
router.get('/email/verify', authController.verifyEmail);
router.post('/email/reset', authController.forgotPassword);
router.put('/password/reset', authController.resetPassword);
router.get('/me', validateToken, authController.getCurrentUser);
router.put('/me/update', validateToken, authController.updateUser);
module.exports = router;
