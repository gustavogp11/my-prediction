const fs = require('fs');

const FILE_USERINFO = "/apps/yopredije/users/"

module.exports = {
    findUser: (email) => {
        const filename = Buffer.from(email).toString('base64');
        const path = FILE_USERINFO + filename;
        const exists = fs.existsSync(path);
        if (exists) {
            const content = fs.readFileSync(path);  
            return JSON.parse(content);
        }
        return null;
    },
    saveUser: (email, info) => {
        const filename = Buffer.from(email).toString('base64');
        const path = FILE_USERINFO + filename;
        const exists = fs.existsSync(path);
        if (exists) {
            throw new Error("User already exists");
        }
        const content = JSON.stringify(info);
        fs.writeFileSync(path, content);
    }
}