const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService;
const dbService = require('../services/db.service');
const appStats = require('../appStats');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const dateUtils = require('common-web').dateUtils;

router.get('/create', function(req, res, next) {
    console.log(req.sessionID);
    if(req.session.auth) {
        res.render('create-message');
    } else {
        res.render('error', {errorPage: '401'});
    }
}); 

router.get('/:msgAddress', function(req, res, next) {
    var uuid = req.params.msgAddress;
    dbService.select("select * from message where msg_uuid = ?", [ uuid ]).then(results => {
        var message = results[0];
        res.render('message', {message: message});
    });
  }); 

router.get('/', function(req, res, next) {
    console.log(req.sessionID);
    dbService.select('select * from message').then(results => {
        msgs = results ? results : [];
        res.render('messages', {messages: msgs});
    })
}); 

async function validateMessage(msg, author) {
    if(msg.length > 255) {
        return "La longitud del mensaje debe ser < 256";
    }
    var limitDate = new Date().getTime() - 15*60*1000;
    var results = await dbService.select('select * from message where author = ? and created_at > ? limit 1 ', [author, limitDate]);
    if(results.length) {
        return "Debe esperar 15min para crear un nuevo mensaje. (Ult. creado: " + dateUtils.format(results[0].created_at) + ")";
    }
    return null;
}

router.post('/', async function (req, res, next) {
    var message = req.body.message;
    var errmsg = await validateMessage(message, req.session.auth.email);
    if(errmsg) {
        return res.render('error', {errorMessage: errmsg});
    }
    var sha256 = "0x"+crypto.createHash('sha256').update(uuidv1()).digest('hex');
    contractService().createMessageWithAccount(message, sha256, req.session.auth).then(txResponse => {
        dbService.insert('message', { 
            text: message, 
            created_at: new Date().getTime(), 
            author: req.session.auth.email,
            eth_tx: txResponse,
            msg_uuid: sha256
        });
        appStats.get().increment('messages');
        res.render('success-tx', { tx: txResponse });
    }, err => {
        res.render('error', {errorMessage: err});
    });
});

module.exports = router;
