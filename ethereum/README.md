# Install ganache globally
`npm install ganache --global`

## Start eth local network with ganache (default port 8545)
```bash
	ganache-cli -m "sample dog come year spray crawl learn general detect silver jelly pilot"
```
## Compile and deploy contract (from within this dir)
```bash
	rm -rf build
	truffle compile && truffle migrate --reset
```

##  Working with truffle console (execute it from within this dir)

### Start the console
Start the console (placed at this directory): `truffle console`

### Get contract address:
```bash
    > PredictionMessage.deployed().then(c => console.log(c.address));
```

```bash
> truffle console

    > PredictionMessage.deployed().then(c => c.registerNewUser("my.email@any-domain.com", "123"))
    > PredictionMessage.deployed().then(c => c.getUsers())
    > PredictionMessage.deployed().then(c => c.getUser('0x0ac21f1a6fe22241ccd3af85477e5358ac5847c2'))
    > PredictionMessage.deployed().then(c => c.createMessage("Helloworld!!!"))
    > PredictionMessage.deployed().then(c => c.getAllMessages())
    > PredictionMessage.deployed().then(c => c.validateUser('123'))

    > accounts = await web3.eth.getAccounts()

    > PredictionMessage.deployed().then(c => c.registerNewUser("any.other.email@any-domain.com", "123", {from: accounts[1]}))
    > PredictionMessage.deployed().then(c => c.createMessage("Mars colony in 2050", {from: accounts[1]}))

    > PredictionMessage.deployed().then(c => c.enableUser(accounts[1], {from: accounts[1]}))
```

### GETTING KEYSTORE (for modifying operations)
```bash
    > web3.eth.accounts.encrypt('0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', 'myPassword');
```
### Gets the keystore for address=0x2c7536e3605d9c16a7a3d7b1898e529396a65c23
```bash
    > web3.eth.sendTransaction({from:'0x0Ac21F1a6fE22241CCD3Af85477E5358ac5847c2', to:'0x2c7536e3605d9c16a7a3d7b1898e529396a65c23', value:1000000000000000000})
```

### EXISTING ACCOUNT: 0x0Ac21F1a6fE22241CCD3Af85477E5358ac5847c2
```bash
    > web3.eth.accounts.encrypt('0x91e639bd434790e1d4dc4dca95311375007617df501e8c9c250e6a001689f2c7', 'myPassword');
```
