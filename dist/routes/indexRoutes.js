"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class IndexRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.get('/', (req, res) => res.send('<p>Api Mainnet: http://localhost:3000/api/near/mainnet/getLandingPageParas</p> <br> <p>Api Testnet: http://localhost:3000/api/near/testnet/getLandingPageParas</p>'));
    }
}
const indexRoutes = new IndexRoutes();
indexRoutes.routes();
exports.default = indexRoutes.router;
