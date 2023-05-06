const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService;
const loginService = require('common-web').services.loginService;
const googleUtils = require('common-web').googleUtils;

function generateRandomPhrase() {
    return [0,1,2,3,4,5].map(n => Math.trunc(Math.random()*10000000000).toString(36)).join(" ");
}

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.sessionID);
    res.render('index', { title: 'Express' });
});

router.get('/contract-abi', function (req, res, next) {
    res.send(contractService().contractAbiJson);
});

router.get('/auth/google/callback', function (req, res, next) {
    const code = req.param('code');
    googleUtils.getGoogleAccountFromCode(code).then(googleResponse => {
        var userExisting = loginService.findUser(googleResponse.email);
        if(!userExisting) {
            //redirect register google to complete registration
            var passwordPhrase = generateRandomPhrase();
            if(!req.session.register)
                req.session.register = {};
            var registerId = 'google:' + googleResponse.id;
            req.session.register[registerId] = googleResponse.email;
            res.render('register-google', {passwordPhrase : passwordPhrase, registerId: registerId}); 
        } else {
            //el usuario existe autenticamos...
            req.session.auth = contractService().loadCredentials(userExisting.keystore, userExisting.password);
            res.render('index');
        }
    });    
});

router.get('/logout', function (req, res, next) {
    req.session.auth = null;
    res.render('index');
});


module.exports = router;
