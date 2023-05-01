require('dotenv').config();

module.exports = {
    ethereum: {
        httpProvider: process.env.ETHEREUM_SERVER,
        chain: process.env.ETHEREUM_CHAIN,
        networkName: process.env.ETHEREUM_NETWORK,
        contractAddress: process.env.ETHEREUM_CONTRACT_ADDRESS,
        viewTxUrl: process.env.ETHEREUM_VIEW_TX_URL,        
        keystorePasword: process.env.ETHEREUM_KEYSTORE_PASSWORD   
    },
    smtp: {
        enabled: process.env.SMTP_ENABLED,
        from: process.env.SMTP_FROM,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        host: process.env.SMTP_SERVER,
        port: +process.env.SMTP_PORT
    },
    baseUrl: process.env.APP_BASE_URL,
    server: process.env.APP_SERVER,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    },
    oauth2: {
        google: {
            clientId: process.env.OAUTH2_GOOGLE_CLIENT_ID,
            clientSecret: process.env.OAUTH2_GOOGLE_CLIENT_SECRET
        }
    },
    appPathConfig: process.env.APP_PATH_CONFIG
}