"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    username: { type: String, required: true, unique: true, lowercase: true },
    createdAt: { type: Date, required: true, default: Date.now() },
    updatedAt: Date,
    posts: [{ ref: 'Post', type: mongoose_1.Schema.Types.ObjectId }],
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
