require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const socketio = require('socket.io');
const https = require('https');

const passportInit = require('./passportInit');
const authRouter = require('./router');

const app = express();

app.use(cors());
app.use(passport.initialize());
passportInit();

const certOptions = {
  key: fs.readFileSync(path.resolve('certs/server.key')),
  cert: fs.readFileSync(path.resolve('certs/server.crt')),
};
const server = https.createServer(certOptions, app);

const io = socketio(server);
app.set('io', io);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use('/', authRouter);

const port = 8080;

server.listen(process.env.PORT || port, () => {
  console.log('listening...,', port);
});
