"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const higgsfieldAPI = axios_1.default.create({
    baseURL: 'https://higgsfield.io/api/v1',
});
//higgsfieldAPI.get('/calendar/main_page')
//higgsfieldAPI.get('/search/main_statistics')
//higgsfieldAPI.get('/search/popular')
// higgsfieldAPI.post('/search/search', {
//     "next_id":null,"limit":25,"days":1000,"name":"collectables"
// })
//higgsfieldAPI.get('/collections/get/{customURLorID}')
exports.default = higgsfieldAPI;
