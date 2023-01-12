const mongoose = require('mongoose');

const optSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    code: {
        type: Number,
    },
    expireTime: {
        type: String,
        
    }
}, {
    timestamps: true
});


const Otp = mongoose.model('Otp', optSchema);

module.exports = Otp;