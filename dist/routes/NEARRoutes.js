"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const functionsRpc_1 = require("../utils/functionsRpc");
class NEARRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    async getCart(req, res) {
        res.send('NEAR API');
    }
    routes() {
        //Añadir parametro user: ?user=
        this.router.get('/Cart', async (req, res) => {
            var _a;
            const user = (_a = req.query.user) === null || _a === void 0 ? void 0 : _a.toString();
            if (typeof user === 'undefined') {
                res.status(400).send('User is not defined');
            }
            else if (user === '') {
                res.status(400).send('User is empty');
            }
            else if (typeof user === 'string') {
                res.status(200).json(await functionsRpc_1.FunctionsRpc.getCartItems(user));
                //console.log(await FunctionsRpc.getCartItems(user));
            }
            else {
                console.log('User is not a string + ' + user);
            }
        });
        //Añadir parametro account: ?account=
        //Añadir parametro contract: &contract=
        this.router.get('/NftMetadata', (req, res) => {
        });
    }
}
const nearRoutes = new NEARRoutes();
exports.default = nearRoutes.router;
