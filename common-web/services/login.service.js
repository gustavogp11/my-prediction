const fs = require('fs');
const path = require('path');

const USERINFO = {};

module.exports = {
    findUser: (email) => {
        return USERINFO[email]
            ? JSON.parse(USERINFO[email])
            : null;
    },
    saveUser: (email, info) => {
        const exists = USERINFO[email];
        if (exists) {
            throw new Error("User already exists");
        }
        USERINFO[email] = JSON.stringify(info);
    },
    deleteUser: (email) => {
        delete USERINFO[email];
    }
}