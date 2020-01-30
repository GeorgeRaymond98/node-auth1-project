const express = require('express');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const apiRouter = require('./apiRouter.js');
const userRouter = require('../users/user-router');
const authRouter = require('../auth/auth-router');
const helmet = require('helmet');
const cors = require('cors');
const dbConnection = require('../database/dbConfig');
const server = express();

const sessionConfig = {
    name: "gyal dem sugar", // default is connect.sid
    secret: process.env.SESSION_SECRET || 'Shhhh... gyal dem sugar!',
    cookie: {
        maxAge: 1000 * 30,
        secure: false, // only set cookies over https. Server will not send back a cookie over http. Set to true for production
    }, // 30 seconds in milliseconds
    httpOnly: true, 
    resave: false,
    saveUninitialized: true, 
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 60000,
    }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api', apiRouter);
server.use('/api/auth', authRouter);
server.use('/api/users', userRouter);


module.exports = server;