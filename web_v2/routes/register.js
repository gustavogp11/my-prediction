const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService;
const loginService = require('common-web').services.loginService;
const googleUtils = require('common-web').googleUtils;

router.get('/', function (req, res, next) {
    var urlGoogle = googleUtils.urlGoogle();
    res.render('register', {urlGoogle : urlGoogle});
});

router.post('/', function (req, res, next) {
    var password = req.body.password;
    var registerId = req.body.registerId;
    contractService().createAccount(password).then(response => {
        if(!req.session.register[registerId]) {
            return res.render('error', {errorPage: '500'});
        } else {
            var email = req.session.register[registerId];
            delete req.session.register[registerId];
            loginService.saveUser(email, response);
            res.render('register-completed', { result: response });
        }
    })
});


module.exports = router;
