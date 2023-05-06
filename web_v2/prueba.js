var Web3 = require('web3');
const fs = require('fs');
var path = require('path');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var GeektAddress = '0xdDe23Fa57399b0a53A5A286F9f65F6888BD85Cf1';

let geekAbiJsonRaw = fs.readFileSync(path.join(__dirname, './geekt-contract-abi.json'));
var GeektABI = JSON.parse(geekAbiJsonRaw);

var GeektContract = new web3.eth.Contract(GeektABI, GeektAddress);

defaultAccount = web3.eth.accounts[0];

GeektContract.methods.getUsers().call(function(err,usersResult){
    console.log(usersResult);
});

GeektContract.methods.getUser('0x0Ac21F1a6fE22241CCD3Af85477E5358ac5847c2').call(function(err,usersResult){
    console.log(usersResult);
});
