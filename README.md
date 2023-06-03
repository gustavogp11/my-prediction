# My Prediction

## Summary
A simple showcase project to show a use case of dApps, using Ethereum and integrating
a contract with a webapp.

### Description
Users post an irreversible message in the blockchain using a Smart Contract,
it will be easy for them to confirm the message are theirs provide that they
send another message from the same account.

### Working with Ethereum
Refer to this [document](ethereum/README.md)
To properly use the application you will have to transfer founds to the account you are using

### Additional features for demo purpose
The application provides a login by keystore and google oauth2,
for the google auth, the application creates automatically a keystore/password that is stored
in-memory in the application and provides the user with that keystore.
After signing in, the next step before creating messages is to register the user with an
email, internally the contract will store an email+token, that could be validated afterwards.

### Using Metamask
_Pending: to be implemented_

## Technologies used
- Ethereum with Solidity
- ganache
- truffle
- node 
- ejs

## Configuration
All the configuration is stored in `.env` file   
It is required to configure the following to integrate with the services:
1. Google Auth: using the variables `OAUTH2_GOOGLE_CLIENT_ID`, `OAUTH2_GOOGLE_CLIENT_SECRET`
_To local development, configure the URL at google, e.g. **http://localhost:${PORT}/auth/google/callback**_
2. Email provider: use the variable `EMAIL_PROVIDER`, could be **smtp** or **filesystem** 
_File System is only for development purpose to store the files in a location using `EMAIL_FS_LOCATION`_
_instead of configuring a SMTP provider_


## Install & Run

### Before running the application
Compile and deploy the contract [ethereum/README.md](ethereum/README.md)

### Run application
Go to _web_ directory and run `npm start`
_To change the port: `PORT=7777 npm start`_

### How to use it
Access to the application `http://localhost:5555` 

# TO Continue
1. Language
2. review and commit
3. add metamask integration
