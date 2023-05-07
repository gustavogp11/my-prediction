const fs = require('fs');
const path = require('path');

const FILE_USERINFO = "/apps/yopredije/users/"

function pathByEmail(email) {
    const filename = Buffer.from(email).toString('base64');
    return path.join(FILE_USERINFO, filename);
}

module.exports = {
    findUser: (email) => {
        const path = pathByEmail(email);
        const exists = fs.existsSync(path);
        if (exists) {
            const content = fs.readFileSync(path);  
            return JSON.parse(content);
        }
        return null;
    },
    saveUser: (email, info) => {
        const path = pathByEmail(email);
        const exists = fs.existsSync(path);
        if (exists) {
            throw new Error("User already exists");
        }
        const content = JSON.stringify(info);
        fs.writeFileSync(path, content);
    },
    deleteUser: (email) => {
        const path = pathByEmail(email);
        return fs.rmSync(path);
    }
}