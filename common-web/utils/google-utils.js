const { google } = require('googleapis');
const appConfig = require('../appConfig');

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
    clientId: appConfig.oauth2.google.clientId, 
    clientSecret: appConfig.oauth2.google.clientSecret, 
    redirect: appConfig.server + appConfig.baseUrl + 'auth/google/callback', // this must match your google api settings
};

const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.email',
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
function urlGoogle() {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
async function getGoogleAccountFromCode(code) {
    const auth = createConnection();
    const data = await auth.getToken(code);
    console.log(data);
    const tokens = data.tokens;
    auth.setCredentials(tokens);
  
    var oauth2 = google.oauth2({
        auth: auth,
        version: 'v2'
    });

    const userProfile = await oauth2.userinfo.v2.me.get();

    return {
        id: userProfile.data.id,
        email: userProfile.data.email,
        tokens: tokens,
    };
}

module.exports = {
    urlGoogle: urlGoogle,
    getGoogleAccountFromCode: getGoogleAccountFromCode
}