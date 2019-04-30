const lrv2 = require('loginradius-sdk');

const config = {
  apidomain: 'https://api.loginradius.com',
  apikey: process.env.LRV_KEY,
  apisecret: process.env.LRV_SECRET,
  sitename: 'http://www.loginradius.com',
  region: '',
  proxy: {
    protocol: '',
    host: '',
    port: '',
    user: '',
    password: '',
  },
};

module.exports = lrv2(config);
