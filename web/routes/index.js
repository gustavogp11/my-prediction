const express = require('express');
const router = express.Router();
const contractService = require('common-web').services.contractService();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.sessionID);
    res.render('index', { title: 'Express' });
});

router.get('/contract-abi', function (req, res, next) {
    res.send(contractService.contractAbiJson);
});

router.get('/tx/:address', function (req, res, next) {
    var address = req.params.address;
    res.send(`
        <h3>Congratulations, this is the Tx ${address}</h3>
        <h4>This is the end of the showcase at localhost. Usually this could be an external ethscan URL.</h4>
        <a href="/">Return home</a>
    `);
});

router.get('/logout', function (req, res, next) {
    req.session.auth = null;
    res.render('index');
});


module.exports = router;
