const express = require('express');
const jwt = require('jsonwebtoken');
const route = express.Router();
const authentic = require('../models/authenticModel.js');
const db = require("../models/db.js");
const bcrypt = require('bcrypt');
require('dotenv').config();

/* GET all scouts on data base. */
route.get('/', async function(req, res, next) {
  try {
    res.json(await authentic.getListUsers(req.query.page));
  } catch (err) {
    console.error(`Erro ao tentar buscar os usuários `, err.message);
    next(err);
  }
});

route.get('/:id', async function(req, res, next) {
  try {
    res.json(await authentic.getById(req.params.id));
  } catch (err) {
    console.error(`Erro ao tentar buscar os usuários `, err.message);
    next(err);
  }
});

route.get('/:gmail', async function(req, res, next) {
  try {
    res.json(await authentic.get(req.params.gmail));
  } catch (err) {
    console.error(`Erro ao tentar buscar os usuários `, err.message);
    next(err);
  }
});


route.post( '/login', async function (req, res, next){
  const { gmail, password } = req.body;
    try {
        console.log(gmail, password)
        const scriptSQL = `select email_scout_login from scout_login where email_scout_login = '` + gmail + `' and strcmp(password_scout_login, '` + password + `') = 0;`
        console.log(scriptSQL);
        const result = await db.query(scriptSQL);
        console.log(result);

        if(result.length > 0){
          res.status(200).send({mensagem: "Login efetuado com sucesso!"})
          res.status(200).send({auth: true})
          return;

        }else{
          res.send({mensagem: "Login ou password incorretos!"})
          return;
        }

    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send({mensagem: "Erro na conexão BD"})
    }
});

  route.delete('/', async function (req, res, next){

    const scriptSQL = `delete from scout_login where email_scout_login = '` + req.body.gmail + `';`;

    try {

      const result = await db.query(scriptSQL);
      res.status(200).send({mensagem: "Utilizador eliminado com sucesso!"});

    } catch (err) {

          console.error('SQL error', err);
          res.status(500).send({mensagem: "Erro na conexão BD"})

    }
  });



module.exports = route;
