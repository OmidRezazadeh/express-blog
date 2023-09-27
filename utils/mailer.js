const { info } = require('console');
const nodemailer=require('nodemailer');
const smtpTransport= require('nodemailer-smtp-transport');
const transportDatails= smtpTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "c26591442df084",
          pass: "a7c0027fee8395"
        },
        tls:{
            rejectUnauthorized:false
        }
})
const transporter= nodemailer.createTransport(transportDatails);
const options={
    from:"omid@gmail.com",
    to:"orprogrammer@gmail.com",
    subject:"test",
    text:"test send"
}

transporter.sendMail(options,(err,info)=>{
    if(err) return console.log(err);
    console.log(info);
});