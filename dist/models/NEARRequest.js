"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NEARRequestSchema = new mongoose_1.Schema({
    receivedAccount: String,
    receivedContract: String,
});
exports.default = (0, mongoose_1.model)('NEARRequest', NEARRequestSchema);
