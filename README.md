# My Prediction

## Summary
A simple showcase project to show a use case of dApps, using Ethereum and integrating
a contract with a webapp.

## Technologies used
- Ethereum with Solidity
- ganache
- truffle

## Configuration
All the configuration is stored in `.env` file   
It is required to configure the following to integrate with the services:
1. Google Auth: using the variables `OAUTH2_GOOGLE_CLIENT_ID`, `OAUTH2_GOOGLE_CLIENT_SECRET`
_To local development, configure the URL at google, e.g. **http://localhost:${PORT}/auth/google/callback**_
2. Email provider: use the variable `EMAIL_PROVIDER`, could be **smtp** or **filesystem** 
_File System is only for development purpose to store the files in a location using `EMAIL_FS_LOCATION`_
_instead of configuring a SMTP provider_


## Install & Run

### Before running the UI
Compile and deploy the contract [ethereum/README.md](ethereum/README.md)

### Run UI
Go to _web_ directory and run `npm start`
_To change the port: `PORT=7777 npm start`_

### How to use it
Access to the application `http://localhost:5555` 

