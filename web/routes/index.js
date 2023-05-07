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

router.get('/tx/:address', async function (req, res, next) {
    const address = req.params.address;
    contractService.getTransaction(address).then(tx => {
        if (tx) {
            res.send(`
                <h3>Congratulations, this is the Tx ${address}</h3>
                <pre>${JSON.stringify(tx, null, 4)}</pre>
                <h4>This is the end of the showcase at localhost. Usually this could be an external ethscan URL.</h4>
                <a href="/">Return home</a>
            `);
        } else {
            res.send(`
                <h3>Transaction not found: ${address}</h3>
                <a href="/">Return home</a>
            `);
        }
    }, (error) => {
        res.send(`
            <h3>Transaction error: ${error.message}</h3>
            <a href="/">Return home</a>
        `);
    });
});

router.get('/logout', function (req, res, next) {
    req.session.auth = null;
    res.render('index');
});


module.exports = router;
