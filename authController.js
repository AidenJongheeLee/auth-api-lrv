const axios = require('axios');

const lrv = require('./lrvConfig');

exports.emailLogin = async (req, res) => {
  try {
    const data = req.body;
    const login = await lrv.authentication.login.byEmail(data.email, data.password);
    res.json(login);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.emailSignup = async (req, res) => {
  try {
    const data = req.body;
    const user = await lrv.authentication.register(data, `${process.env.ORIGIN}/verify`);
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const verify = await lrv.authentication.getVerifyEmail(token);
    res.json(verify);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const reset = await lrv.authentication.forgotPassword(email, `${process.env.ORIGIN}/reset`);
    res.json(reset);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    const reset = await lrv.authentication.resetPassword(token, password);
    res.json(reset);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const { token } = req.query;
    const profile = await lrv.socialLogin.getUserProfile(token);
    if (profile.errorCode) {
      res.status(400).json(profile);
    } else {
      res.json(profile);
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { uid, Password, ...data } = req.body;
    if (Password) await lrv.account.setPassword(uid, Password);
    const newUser = await lrv.account.update(uid, data);
    res.json(newUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.twitter = async (req) => {
  const io = req.app.get('io');
  try {
    const { accessToken, refreshToken } = req.authInfo;
    const token = await lrv.accessToken.getTwitterToken(accessToken, refreshToken);
    const user = {
      name: req.user.username,
      access_token: token.access_token,
    };
    io.in(req.session.socketId).emit('twitter', user);
  } catch (error) {
    io.in(req.session.socketId).emit('twitter', error);
  }
};

exports.google = async (req) => {
  const io = req.app.get('io');
  try {
    const { accessToken } = req.authInfo;

    const token = await axios.get('https://api.loginradius.com/api/v2/access_token/google', {
      params: {
        key: process.env.LRV_KEY,
        google_access_token: accessToken,
      },
    });
    const user = {
      access_token: token.data.access_token,
    };
    io.in(req.session.socketId).emit('google', user);
  } catch (error) {
    io.in(req.session.socketId).emit('google', error);
  }
};

exports.facebook = async (req) => {
  const io = req.app.get('io');
  try {
    const { accessToken } = req.authInfo;
    const { givenName, familyName } = req.user.name;
    const token = await lrv.accessToken.getFacebookToken(accessToken);
    const user = {
      name: `${givenName} ${familyName}`,
      access_token: token.access_token,
    };
    io.in(req.session.socketId).emit('facebook', user);
  } catch (error) {
    io.in(req.session.socketId).emit('facebook', error);
  }
};
