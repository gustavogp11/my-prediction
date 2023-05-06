const Web3 = require('web3');
const fs = require('fs');
const EthereumTx = require('ethereumjs-tx').Transaction;
const appConfig = require('../appConfig');

var contractInstance = null;

function readFileJson(filename) {
    var content = fs.readFileSync(filename);  
    return JSON.parse(content);
}

class ContractService {
    
    constructor() {
        const web3 = new Web3(new Web3.providers.HttpProvider(appConfig.ethereum.httpProvider));

        const contractAddress = appConfig.ethereum.contractAddress; // replace by the one in json networks.{any}.address

        this.contractAbiJson = readFileJson(appConfig.ethereum.contractJsonPath).abi;
         
        this.contract = new web3.eth.Contract(this.contractAbiJson, contractAddress);

        web3.eth.getAccounts().then(accounts => {
            this.defaultAccount = accounts[0];
        });
        this.web3 = web3;
        this.ethTransactionOptions = {};
        if (appConfig.ethereum.chain && appConfig.ethereum.chain != '') {
            this.ethTransactionOptions = { 'chain': appConfig.ethereum.chain } //this is NECCESARY ('ropsten')
        }
    }

    loadCredentials(keystore, password) {
        const decryptedAccount = this.web3.eth.accounts.decrypt(keystore, password);
        return decryptedAccount;
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            this.contract.methods.getUsers().call(function(err,usersResult){
                console.log(usersResult);
                resolve(usersResult);
            });
        });
    }

    getUser(address) { //address: '0x0Ac21F1a6fE22241CCD3Af85477E5358ac5847c2'
        return new Promise((resolve, reject) => {
            try {
                this.contract.methods.getUser(address).call(function(err,usersResult){
                    resolve(usersResult);
                });
            } catch(ex) {
                reject(ex.message);
            }
        });
    }

    getMessage(sha256) {
        return new Promise((resolve, reject) => {
            this.contract.methods.getMessage(sha256).call(function(err,response){
                if(!err)
                    resolve(response);
                else
                    reject(err);
            });
        });
    }

    getAllMessages() {
        return new Promise((resolve, reject) => {
            this.contract.methods.getAllMessages().call(function(err,response){
                resolve(response);
            });
        });
    }

    sendSignedTransaction(resolve, reject, opts) {
        if (appConfig.ethereum.useOwnerAccount) {
            opts.loggedAccount = this.getOwnerAccount();
        }
        opts.from = opts.loggedAccount.address;
        this.web3.eth.getTransactionCount(opts.from).then(nonce => {
            var rawTransaction = {
                "nonce": this.web3.utils.toHex(nonce),
                "from": opts.from, 
                "gasPrice":this.web3.utils.toHex(20* 1e9),
                "gasLimit":this.web3.utils.toHex(210000),
                "to": this.contract._address,
                "value":"0x0",
                "data": opts.data,
            }
            console.log(rawTransaction);
            //creating tranaction via ethereumjs-tx
            var transaction = new EthereumTx(rawTransaction, this.ethTransactionOptions); 
            //signing transaction with private key
            transaction.sign(Buffer.from(opts.loggedAccount.privateKey.substr(2), 'hex'));
            //sending transacton via web3js module
            this.web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
                .on('transactionHash', function( response) {
                    resolve(response);
            }).catch(ex => { console.error(ex); reject(ex); });
        });
    }

    createMessageWithAccount(text, sha256, loggedAccount) {
        return new Promise((resolve, reject) => {
            this.sendSignedTransaction(resolve, reject, {
                data: this.contract.methods.createMessage(text, sha256, loggedAccount.email).encodeABI()
            });
        });
    }

    createMessage(text, loggedAccount) {
        return new Promise((resolve, reject) => {
            this.sendSignedTransaction(resolve, reject, {
                loggedAccount: loggedAccount,
                data: this.contract.methods.createMessage(text).encodeABI()
            });
        });
    }

    registerUser(email, token, loggedAccount) {
        return new Promise((resolve, reject) => {
            this.sendSignedTransaction(resolve, reject, {
                loggedAccount: loggedAccount,
                data: this.contract.methods.registerNewUser(email, token).encodeABI()
            });
        });
    }

    validateUser(token, loggedAccount) {
        return new Promise((resolve, reject) => {
            this.sendSignedTransaction(resolve, reject, {
                loggedAccount: loggedAccount,
                data: this.contract.methods.validateUser(token).encodeABI()
            });
        });
    }

    createAccount(password) {
        return new Promise((resolve, reject) => {
            var response = this.web3.eth.accounts.create();
            const keystoreEncrypted = this.web3.eth.accounts.encrypt(response.privateKey, password);
            resolve({
                keystore: keystoreEncrypted,
                password: password
            });
        });
    }

    getOwnerAccount() {
        var keystoreContent = readFileJson(appConfig.appPathConfig + '/keystore.json');
        var account = this.web3.eth.accounts.decrypt(keystoreContent, appConfig.ethereum.keystorePasword);
        return account;
    }
}

module.exports = function contractService() {
    if(contractInstance == null)
        contractInstance = new ContractService();
    return contractInstance;
}
