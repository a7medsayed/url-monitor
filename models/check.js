const mongoose = require("mongoose");
const checkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
    },
    userId: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: false,
        lowercase: true,
    },
    url: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        enum: ["running", "paused"],
        default: "running",
    },
    lastStatus: {
        type: String,
        enum: ["up", "down"],
        default: "up",
    },
    protocol: {
        type: String,
    },
    path: {
        type: String,
        required: false,
    },
    port: {
        type: Number,
        required: false,
    },
    webhook: {
        type: String,
        required: false,
    },
    timeout: {
        type: Number,
        required: false,
        default: 5,
    },
    interval: {
        type: Number,
        required: false,
        default: 10,
    },
    threshold: {
        type: Number,
        required: false,
        default: 1,
    },
    authentication: {
        type: Object,
        required: false,
    },
    httpHeaders: {
        type: [Object],
        required: false,
    },
    assert: {
        type: Object,
        required: false,
    },
    ignoreSSL: {
        type: Boolean,
    },
});

const Check = mongoose.model("check", checkSchema);

module.exports = Check;