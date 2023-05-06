const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService;
const googleUtils = require('common-web').googleUtils;

router.get('/', function(req, res, next) {
    const urlGoogle = googleUtils.urlGoogle();
    res.render('login', { logged: req.session.auth, urlGoogle: urlGoogle });
});

router.post('/', function (req, res, next) {
    const keystore = req.body.keystore;
    const password = req.body.password;
    req.session.auth = contractService().loadCredentials(keystore, password);
    res.render('index');
});


module.exports = router;
