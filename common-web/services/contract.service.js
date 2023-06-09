const Web3 = require('web3');
const fs = require('fs');
const EthereumTx = require('ethereumjs-tx').Transaction;
const appConfig = require('../app-config');

var contractInstance = null;

function readFileJson(filename) {
    var content = fs.readFileSync(filename);  
    return JSON.parse(content);
}

class ContractService {
    
    constructor() {
        const web3 = new Web3(new Web3.providers.HttpProvider(appConfig.ethereum.httpProvider));

        const jsonContract = readFileJson(appConfig.ethereum.contractJsonPath);

        const networks = jsonContract.networks;
        const networkKey = Object.keys(networks)[0];
        
        this._contractAddress = networks[networkKey].address; // replace by the one in json networks.{any}.address

        this.contractAbiJson = jsonContract.abi;
         
        this.contract = new web3.eth.Contract(this.contractAbiJson, this.contractAddress);

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
                console.error(ex);
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

    sendSignedTransaction(resolve, reject, { loggedAccount, methodAbi }) {
        const tx = {
            from: loggedAccount.address,
            to: this.contract._address,
            gas: this.web3.utils.toHex(20 * 1e9),
            gasLimit: this.web3.utils.toHex(210000),
            value: "0x0",
            data: methodAbi
        };
        const signPromise = this.web3.eth.accounts.signTransaction(tx, loggedAccount.privateKey);
        signPromise.then(async signedTx => {
            try {
                const response = await this.web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
                console.log(`Message saved, transaction: ${response.transactionHash}`);
                resolve(response.transactionHash);
            } catch (ex) {
                console.error(ex);
                reject(ex.message);
            }
        }, reject);
    }

    createMessage(text, loggedAccount) {
        return new Promise((resolve, reject) => {
            this.sendSignedTransaction(resolve, reject, {
                loggedAccount,
                methodAbi: this.contract.methods.createMessage(text).encodeABI()
            });
        });
    }

    registerUser(email, token, loggedAccount) {
        return new Promise((resolve, reject) => {
            this.sendSignedTransaction(resolve, reject, {
                loggedAccount,
                methodAbi: this.contract.methods.registerNewUser(email, token).encodeABI()
            });
        });
    }

    validateUser(token, loggedAccount) {
        return new Promise((resolve, reject) => {
            this.sendSignedTransaction(resolve, reject, {
                loggedAccount,
                methodAbi: this.contract.methods.validateUser(token).encodeABI()
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

    getTransaction(address) {
        address = !address.startsWith('0x') ? `0x${address}` : address;
        return this.web3.eth.getTransaction(address);
    }

    getOwnerAccount() {
        const keystoreContent = readFileJson(appConfig.appPathConfig + '/keystore.json');
        const account = this.web3.eth.accounts.decrypt(keystoreContent, appConfig.ethereum.keystorePasword);
        return account;
    }

    get contractAddress() {
        return this._contractAddress;
    }
}

module.exports = function contractService() {
    if(contractInstance == null)
        contractInstance = new ContractService();
    return contractInstance;
}
