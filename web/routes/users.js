const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService();
const crypto = require('crypto');
const appStats = require('../appStats');
const emailService = require('common-web').services.emailService();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(`sessionID: ${req.sessionID}`);
    contractService.getUsers().then(users => {
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
    var token = req.body.token;
    contractService.validateUser(token, req.session.auth).then(txResponse => {
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
    var email = req.body.email;
    var strToTokenize = "" + email + ":" + new Date().getTime();
    var token = crypto.createHash('sha256').update(strToTokenize).digest('hex');
    console.log('tokenValidate: ' + token);
    contractService.registerUser(email, token, req.session.auth).then(txResponse => {
        appStats.get().increment('users');
        sendRegisterValidationEmail(email, token);
        res.render('success-tx', { tx: txResponse });
    }, err => {
        res.render('error', {errorMessage: err});
    });
});

router.get('/:userId', function(req, res, next) {
    var userId = req.params.userId;
    contractService.getUser(userId).then(user => {
        if(user && user[2] > 0) {
            var userObject = {
                address: userId,
                email: user[0],
                validatedAt: user[1],
                createdAt: user[2],
                myMessages: user[3],
                enabled: user[4]
            };
            res.render('user', {user: userObject});
        } else {
            res.render('error', {errorPage: '404'});
        }
    }, err => {
        res.render('error', {errorMessage: err})
    });
  }); 

module.exports = router;
