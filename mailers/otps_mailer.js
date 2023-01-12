const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.otpSent = (generateOtp) => {
    
    let htmlString = nodeMailer.renderTemplate({generateOtp: generateOtp}, '/send_otps/sent_otp_structure.ejs');

    nodeMailer.transporter.sendMail({
       from: 'vmahajan27996@gmail.com',
       to: generateOtp.email,
       subject: "Codeial-Send Otp for verification!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}