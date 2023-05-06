const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService;
const crypto = require('crypto');
const appStats = require('../appStats');
const emailService = require('common-web').services.emailService();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.sessionID);
    contractService().getUsers().then(users => {
        users = users ? users : [];
        res.render('users', { users: users});
    });  
});

router.get('/create', function(req, res, next) {
    if(req.session.auth) {
        res.render('register-user');
    } else {
        res.render('error', {errorPage: '401'});
    }
});

router.get('/validate', function(req, res, next) {
    if(req.session.auth) {
        res.render('validate-user');
    } else {
        res.render('error', {errorPage: '401'});
    }
});

router.post('/validate', function(req, res, next) {
    const token = req.body.token;
    contractService().validateUser(token, req.session.auth).then(txResponse => {
        appStats.get().increment('validations');
        res.render('success-tx', { tx: txResponse });
    }, err => {
        res.render('error', {errorMessage: err});
    });
});

function sendRegisterValidationEmail(email, token) {
    emailService.send({to: email, subject: 'Validar email', html: 'Token para validar: ' + token})
}

router.post('/', function(req, res, next) {
    const email = req.body.email;
    const strToTokenize = "" + email + ":" + new Date().getTime();
    const token = crypto.createHash('sha256').update(strToTokenize).digest('hex');
    console.log('tokenValidate: ' + token);
    contractService().registerUser(email, token, req.session.auth).then(txResponse => {
        appStats.get().increment('users');
        sendRegisterValidationEmail(email, token);
        res.render('success-tx', { tx: txResponse });
    }, err => {
        res.render('error', {errorMessage: err});
    });
});


module.exports = router;
