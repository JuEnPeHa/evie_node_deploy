"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearAccountInstance = exports.getNearContract = exports.nearAccountCallerTestnet = exports.nearAccountCallerMainnet = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
//import mongoose from 'mongoose';
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const PostRoutes_1 = __importDefault(require("./routes/PostRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const helmet_1 = __importDefault(require("helmet"));
const nearAPI = __importStar(require("near-api-js"));
const NEARRoutesMainnet_1 = __importDefault(require("./routes/NEARRoutesMainnet"));
const NEARRoutesTestnet_1 = __importDefault(require("./routes/NEARRoutesTestnet"));
const NEARRoutes_1 = __importDefault(require("./routes/NEARRoutes"));
var functionsMainnet = require('./routes/NEARRoutesMainnet');
exports.nearAccountCallerMainnet = functionsMainnet.nearAccountCallerMainnet();
var functionsTestnet = require('./routes/NEARRoutesTestnet');
exports.nearAccountCallerTestnet = functionsTestnet.nearAccountCallerTestnet();
const getNearContract = (account, contractForInteraction, method) => {
    const contract = new nearAPI.Contract(account, 
    //"x.paras.near",
    contractForInteraction, {
        viewMethods: [method],
        changeMethods: []
    });
    return contract;
};
exports.getNearContract = getNearContract;
const getNearAccountInstance = (account) => {
    console.log("account_inside: " + account);
    let mainnet = false;
    if (typeof account === "string") {
        if (account.includes(".near")) {
            mainnet = true;
            return mainnet ? exports.nearAccountCallerMainnet : exports.nearAccountCallerTestnet;
        }
        else if (account.includes(".testnet")) {
            mainnet = false;
            return mainnet ? exports.nearAccountCallerMainnet : exports.nearAccountCallerTestnet;
        }
        else {
            throw new Error("Invalid account or contract");
        }
    }
    else {
        throw new Error("Invalid account or contract");
    }
};
exports.getNearAccountInstance = getNearAccountInstance;
// async function connectDB() {
//     const MONGO_URI = 'mongodb+srv://efwcwwwwce:7sPtSf8mzuTAqfGx@cluster0.w0ka0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//     const db = await mongoose.connect(MONGO_URI || process.env.MONGODB_URI).then(db => console.log('DB connected', db.connection.db.databaseName)).catch(err => console.log(err));
// }
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        //connectDB();
        //connectParasAPI();
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use('/api/posts', PostRoutes_1.default);
        this.app.use('/api/users', UserRoutes_1.default);
        this.app.use('/api/near/mainnet', NEARRoutesMainnet_1.default);
        this.app.use('/api/near/testnet', NEARRoutesTestnet_1.default);
        this.app.use('/api/near', NEARRoutes_1.default);
    }
    async start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
        //FunctionsRpc.nftMetadata("x.paras.near", await nearAccountCallerMainnet);
        //console.log("Server started + ", await FunctionsRpc.getPriceParasNft("paras-token-v2.testnet", "1604"));
    }
}
const server = new Server();
server.start();
