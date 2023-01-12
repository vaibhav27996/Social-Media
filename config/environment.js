const fs = require('fs');
const rfs = require("rotating-file-stream");
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development={
    name:'development',
    asset_path:'./assets',
    session_cookies_key:'blahsomething',
    db:'codeial_development',
    stmp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: 'vmahajan27996@gmail.com',
            pass: 'wwaavoohttbiwuxa'
        }
        ,
        tls: {
            rejectUnauthorized: false
        }
    },
    google_client_id:"296328505040-f944lobm3d2t3km3lf346iqimvnh254m.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret_or_key:"codeial",
    morgan: {
        mode: 'dev',
        options:{stream:accessLogStream}
    }

}



const production={
    name:'production',
    asset_path:process.env.CODEIAL_ASSETS_PATH,
    session_cookies_key:process.env.CODEIAL_SESSION_COOKIES_KEY,
    db:process.env.CODEIAL_DB,
    stmp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: process.env.CODEIAL_EMAIL_USER,
            pass: process.env.CODEIAL_EMAIL_PASS
        }
        ,
        tls: {
            rejectUnauthorized: false
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_URL,
    google_callback_url: process.env.CODEIAL_GOOGLE_CLIENT_CALLBACK_URL,
    jwt_secret_or_key:process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }

    
}

//module.exports=development;
module.exports=eval(process.env.CODEIAL_ENVIRONMENT)==undefined ? development:eval(process.env.CODEIAL_ENVIRONMENT);