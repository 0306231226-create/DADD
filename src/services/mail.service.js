
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});


module.exports = transporter;

// const sendOTPMail = async (email, otp) => {
//     const mailOptions = {
//         from: '"Hệ thống MXH" <no-reply@socialapp.com>', 
//         to: email, 
//         subject: 'Mã xác thực OTP khôi phục mật khẩu',
//         html: `
//             <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
//                 <h2>Khôi phục mật khẩu</h2>
//                 <p>Mã OTP của bạn là: <strong style="color: #2c3e50; font-size: 24px;">${otp}</strong></p>
//                 <p>Mã này có hiệu lực trong 5 phút.</p>
//             </div>
//         `
//     };

//     return await transporter.sendMail(mailOptions);
// };

// module.exports = { sendOTPMail };