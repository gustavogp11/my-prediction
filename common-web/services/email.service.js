const nodemailer = require('nodemailer');
const appConfig = require('../appConfig');
const fs = require('fs');

function sendSmtp(mail) {

    if (!appConfig.email.smtp.enabled) {
        console.log('Config smtp not enabled');
        return;
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: appConfig.email.smtp.host,
        port: appConfig.email.smtp.port,
        secure: (appConfig.email.smtp.port == 465), // true for 465, false for other ports
        auth: {
            user: appConfig.email.smtp.user, // generated ethereal user
            pass: appConfig.email.smtp.password // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: appConfig.email.smtp.from, // sender address
        to: mail.to, // list of receivers
        subject: mail.subject, // Subject line
        html: mail.parser(mail.html) // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function sendFileSystem(mail) {
    if (!fs.existsSync(appConfig.email.filesystem.location)) {
        throw Error(`Email FileSystem impl, location doesn't exist: ${appConfig.email.filesystem.location}`);
    }
    const now = new Date().toISOString();
    const metadata = {
        subject: mail.subject,
        time: now,
        to: mail.to
    }
    const content = mail.parser(mail.html);
    fs.writeFileSync(`${now}.metadata.json`, JSON.stringify(metadata, null, 4));
    fs.writeFileSync(`${now}.content.html`, content);
}

module.exports = function () {
    return {

        send: function (mail) {

            mail.parser = mail.parser ? mail.parser : (s) => s;
            
            const providers = {
                'smtp': sendSmtp,
                'filesystem': sendFileSystem
            }

            const provider = providers[appConfig.email.provider];
            provider(mail);
        }
    }
}
