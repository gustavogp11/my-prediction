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

# Use case showcase with truffle console
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

### Getting keystore (for modifying operations)
```bash
    > web3.eth.accounts.encrypt('0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', 'myPassword');
```

### Get Balance from account: 0x0Ac21F1a6fE22241CCD3Af85477E5358ac5847c2
```bash
    > web3.eth.getBalance('0x444BdCd437f8E5D15a83051c4DD43546f611a46e');
```

### Transfer ETH from one account to another
```bash
    > web3.eth.sendTransaction({from:'0x0Ac21F1a6fE22241CCD3Af85477E5358ac5847c2', to:'0x444BdCd437f8E5D15a83051c4DD43546f611a46e', value:10000000000000000})
```
