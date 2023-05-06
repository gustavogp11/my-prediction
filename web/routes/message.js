const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService;
const appStats = require('../appStats');

router.get('/create', function(req, res, next) {
    console.log(req.sessionID);
    if(req.session.auth) {
        res.render('create-message');
    } else {
        res.render('error', {errorPage: '401'});
    }
}); 

router.get('/:msgAddress', function(req, res, next) {
    var msgAddress = req.params.msgAddress;
    contractService().getMessage(msgAddress).then(msg => {
        var message = {
            address: msgAddress, //SHA256notaryHash
            message: msg[0],
            timestamp: msg[1],
        };
        res.render('message', {message: message});
    });
  }); 

router.get('/', function(req, res, next) {
    console.log(req.sessionID);
    contractService().getAllMessages().then(msgs => {
        msgs = msgs ? msgs : [];
        res.render('messages', {messages: msgs});
    });
}); 

router.post('/', function (req, res, next) {
    const message = req.body.message;
    contractService().createMessage(message, req.session.auth).then(txResponse => {
        appStats.get().increment('messages');
        res.render('success-tx', { tx: txResponse });
    }, err => {
        res.render('error', {errorMessage: err});
    });
});

module.exports = router;
