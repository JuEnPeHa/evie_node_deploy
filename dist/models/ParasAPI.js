"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const parasAPI = axios_1.default.create({
    baseURL: 'https://api-v2-mainnet.paras.id',
});
//parasAPI.get('/top-users?__limit=10')
exports.default = parasAPI;
