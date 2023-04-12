const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
});

const sendEmail = async (to, subject, text, html) => {
    await transporter.sendMail({
        from: `${process.env.user}`, // sender address
        to: `${to}`, // list of receivers
        subject: `${subject}`, // Subject line
        text: `${text}`, // plain text body
        html: `${html}`
    }).then(info => {
        console.log('Email has been sent');
    }).catch(err => {
        console.log(`Error while sending email to user` + err.message)
    });
}

module.exports = sendEmail;