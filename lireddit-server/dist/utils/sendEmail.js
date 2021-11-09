"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer = require("nodemailer");
async function sendEmail(to, html) {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: 'jp6cddmcixewi7gg@ethereal.email',
            pass: 'R596kTt6sy7H6Dv24K',
        },
    });
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>',
        to: to,
        subject: "Hello ✔",
        html,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map