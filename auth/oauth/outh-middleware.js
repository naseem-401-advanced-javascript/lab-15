/* eslint-disable camelcase */
/* eslint-disable strict */
'use strict';

const superagent = require('superagent');
const Users = require('../user.js');

let tokenURL = 'https://github.com/login/oauth/access_token';
let remoteAPI = 'https://api.github.com/user';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_SERVER = process.env.API_SERVER;

module.exports = async function authorize(req, res, next) {
  try {
    let code = req.query.code;
    let remoteToken = await codeTokenExchanger(code);
    let remoteUser = await getRemoteUserInfo(remoteToken);
    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    next(e);
  }
};

async function codeTokenExchanger(code) {
  let tokenResponse = await superagent.post(tokenURL).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(token) {
  let userResponse = await superagent.get(remoteAPI)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  let user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: '222',
  };
  let newUser = new Users(userRecord);
  let user = await newUser.save();
  let token = await newUser.signupTokenGenerator(user);
  return [user, token];
}