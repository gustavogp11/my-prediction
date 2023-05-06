const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService;
const googleUtils = require('common-web').googleUtils;
const dbService = require('../services/db.service');
const Promise = require("bluebird");
const appConfig = require('common-web').appConfig;

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.sessionID);
    const last60d = new Date().getTime() - 60*24*3600*1000;
    Promise.join(
        dbService.select("select count(1) q from message"),
        dbService.select("select count(1) q from message where created_at > ?", [last60d]),
        (countAll, countLast60) => {
            res.render('index', { countAll: countAll[0].q, countLast60: countLast60[0].q });
        }
    );
});

router.get('/contract-abi', function (req, res, next) {
    res.send(contractService().contractAbiJson);
});

router.get('/auth/google/callback', function (req, res, next) {
    const code = req.param('code');
    if(code == 'test')
        return res.redirect(appConfig.baseUrl);
    googleUtils.getGoogleAccountFromCode(code).then(googleResponse => {
        dbService.insert('audit_log', { _type: 'login', _timestamp: new Date().getTime(), _data: googleResponse.email });
        req.session.auth = {
            email: googleResponse.email
        }
        res.redirect(appConfig.baseUrl);
    });    
});

router.get('/logout', function (req, res, next) {
    req.session.auth = null;
    res.redirect(appConfig.baseUrl);
});

router.get('/tx/:txAddress', function (req, res, next) {
    res.render('tx', {tx: req.params.txAddress});
});

module.exports = router;
