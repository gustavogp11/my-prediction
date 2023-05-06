var express = require('express');
var router = express.Router();
var contractService = require('common-web').services.contractService;
var googleUtils = require('common-web').googleUtils;

router.get('/', function(req, res, next) {
    var urlGoogle = googleUtils.urlGoogle();
    res.render('login', { logged: req.session.auth, urlGoogle: urlGoogle });
});

router.post('/', function (req, res, next) {
    var keystore = req.body.keystore;
    var password = req.body.password;
    req.session.auth = contractService().loadCredentials(keystore, password);
    res.render('index');
});


module.exports = router;
