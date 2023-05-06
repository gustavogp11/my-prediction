const express = require('express');
const router = express.Router();
const { googleUtils, appConfig } = require('common-web');
const { contractService } = require('common-web').services;

router.get('/', function (req, res, next) {
    if (appConfig.debug.bypassLogin) {
        req.session.auth = contractService().getOwnerAccount();
        res.render('index');
    } else {
        const urlGoogle = googleUtils.urlGoogle();
        res.render('login', { logged: req.session.auth, urlGoogle: urlGoogle });
    }
});

router.post('/', function (req, res, next) {
    const keystore = req.body.keystore;
    const password = req.body.password;
    req.session.auth = contractService().loadCredentials(keystore, password);
    res.render('index');
});


module.exports = router;
