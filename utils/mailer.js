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
 exports.sendEmail=(email,fullname, subject, message)=>{
    const transporter = nodemailer.createTransport(transportDatails);
    transporter.sendMail({
        from:"omid@gmail.com",
        to:email,
        subject:subject,
        html:`<h1>
        سلام ${fullname}
        </h1>
        <p>${message}</p>`

    })
 }