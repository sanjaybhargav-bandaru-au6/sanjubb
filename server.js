// import express from 'express';
// import Sequelize, { define, INTEGER, STRING } from 'sequelize';

const http = require('http');
const app = require("./app");
const port = parseInt(process.env.Port,10) || 1234 ;
app.set('port', port);

const server =http.createServer(app);
server.listen(port);

// app.listen(1234,() => console.log(`server connected at ${1234}`) );
