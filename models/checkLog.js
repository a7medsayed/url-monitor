const mongoose = require("mongoose");
const checkLogSchema = new mongoose.Schema({
    checkId: {
        type: String,
        required: true,
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
    status: {
        type: String,
        enum: ["up", "down"],
        default: "up",
    },
    responseTime: {
        type: Number,
        required: false,
        default: 5,
    },
}).set("timestamps", true);

const CheckLog = mongoose.model("checklog", checkLogSchema);
module.exports = CheckLog;