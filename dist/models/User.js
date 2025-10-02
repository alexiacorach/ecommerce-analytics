"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
//schema mongoose, defines fields, types, validations and indexes
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        requires: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
