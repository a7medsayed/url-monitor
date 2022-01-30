const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,

    },
    emailToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
    },
    date: {
        type: Date,
        default: Date.now()
    },
})

const User = mongoose.model('user', userSchema);

module.exports = User;