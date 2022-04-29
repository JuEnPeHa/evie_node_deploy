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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const nearAPI = __importStar(require("near-api-js"));
const near_api_js_1 = require("near-api-js");
const express_1 = require("express");
//import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores'
const { networkId, nodeUrl, walletUrl, helperUrl } = (0, config_1.getConfig)(process.env.NODE_ENV || 'testnet');
function getMarketplacesClean(listNftMarketplacesRaw) {
    let listNftMarketplaces = [];
    listNftMarketplacesRaw.forEach((marketplace) => {
        if (marketplace.includes("mintbase") ||
            marketplace.includes("paras") ||
            marketplace.includes("neatar") ||
            marketplace.includes("mintspace")) {
            listNftMarketplaces.push(marketplace);
        }
    });
    return listNftMarketplaces;
}
function getMarketplacesNotEmpties(account, listNftMarketplacesRaw) {
    return __awaiter(this, void 0, void 0, function* () {
        let listInternNftMarketplaces = [];
        for (let index = 0; index < listNftMarketplacesRaw.length; index++) {
            const element = listNftMarketplacesRaw[index];
            const supply = yield getNftSupplyForOwnerPrivate(account, element);
            if (supply != "0") {
                listInternNftMarketplaces.push(element);
            }
        }
        return listInternNftMarketplaces;
    });
}
function getNftTokensFromListForOwnerPrivate(account, listNftMarketplacesNotEmpties) {
    return __awaiter(this, void 0, void 0, function* () {
        let listNfts = [];
        for (let index = 0; index < listNftMarketplacesNotEmpties.length; index++) {
            const element = listNftMarketplacesNotEmpties[index];
            const supply = yield getNftTokensForOwnerPrivate(account, element);
            listNfts.push(supply);
        }
        return listNfts;
    });
}
function getNftSupplyForOwnerPrivate(receivedAccount, receivedContract) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield near.account(receivedAccount);
        const contract = new nearAPI.Contract(account, receivedContract, {
            viewMethods: ['nft_supply_for_owner'],
            changeMethods: []
        });
        // @ts-ignore
        const supply = yield contract.nft_supply_for_owner({
            "account_id": receivedAccount
        });
        console.log("supply");
        console.log(supply);
        return supply;
    });
}
function getNftTokensForOwnerPrivate(receivedAccount, receivedContract) {
    return __awaiter(this, void 0, void 0, function* () {
        const account = yield near.account(receivedAccount);
        const contract = new nearAPI.Contract(account, receivedContract, {
            viewMethods: ['nft_tokens_for_owner'],
            changeMethods: []
        });
        // @ts-ignore
        const supply = yield contract.nft_tokens_for_owner({
            "account_id": receivedAccount
        });
        //console.log("supply");
        //console.log(supply);
        return supply;
    });
}
//testNEAR2();
const near = new near_api_js_1.Near({
    networkId,
    keyStore: new near_api_js_1.keyStores.InMemoryKeyStore(),
    nodeUrl,
    walletUrl,
    helperUrl,
    headers: {}
});
class NEARRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    getNftMetadata(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let listReceivedContractTyped = [];
            const { receivedAccount, listReceivedContract } = req.body;
            listReceivedContract.forEach((i) => {
                listReceivedContractTyped.push(i);
            });
            const listReceivedContractClean = getMarketplacesClean(listReceivedContractTyped);
            const listReceivedContractNotEmpties = yield getMarketplacesNotEmpties(receivedAccount, listReceivedContractClean);
            const listTokens = yield getNftTokensFromListForOwnerPrivate(receivedAccount, listReceivedContractNotEmpties);
            res.json(listTokens);
        });
    }
    getNftTotalSupply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { receivedAccount, receivedContract } = req.body;
            //console.log( await testNEAR2(receivedAccount, receivedContract));
            //res.json(receivedContract);
            const account = yield near.account(receivedAccount);
            const contract = new nearAPI.Contract(account, receivedContract, {
                viewMethods: ['nft_total_supply'],
                changeMethods: []
            });
            // @ts-ignore
            const totalSupply = yield contract.nft_total_supply({});
            res.json(totalSupply);
        });
    }
    getNftTokensForOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { receivedAccount, receivedContract } = req.body;
            const account = yield near.account(receivedAccount);
            const contract = new nearAPI.Contract(account, receivedContract, {
                viewMethods: ['nft_tokens_for_owner'],
                changeMethods: []
            });
            // @ts-ignore
            const tokens = yield contract.nft_tokens_for_owner({
                "account_id": receivedAccount,
                "from_index": "0",
                "limit": 100
            });
            res.json(tokens);
        });
    }
    getNftSupplyForOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { receivedAccount, receivedContract } = req.body;
            const account = yield near.account(receivedAccount);
            const contract = new nearAPI.Contract(account, receivedContract, {
                viewMethods: ['nft_supply_for_owner'],
                changeMethods: []
            });
            // @ts-ignore
            const supply = yield contract.nft_supply_for_owner({
                "account_id": receivedAccount
            });
            res.json(supply);
        });
    }
    getAllNftsFromUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { receivedAccount, receivedContract } = req.body;
        });
    }
    getNftGetSeries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { receivedAccount } = req.body;
            const account = yield near.account(receivedAccount);
            const contract = new nearAPI.Contract(account, "paras-token-v2.testnet", {
                viewMethods: ['nft_get_series'],
                changeMethods: []
            });
            // @ts-ignore
            const series = yield contract.nft_get_series({
                "from_index": "0",
                "limit": 100
            });
            res.json(series);
        });
    }
    routes() {
        this.router.get('/getSupply', this.getNftTotalSupply);
        this.router.post('/getSupply', this.getNftTotalSupply);
        this.router.get('/getTokens', this.getNftTokensForOwner);
        this.router.post('/getTokens', this.getNftTokensForOwner);
        this.router.get('/getSupplyForOwner', this.getNftSupplyForOwner);
        this.router.post('/getSupplyForOwner', this.getNftSupplyForOwner);
        this.router.get('/getMetadata', this.getNftMetadata);
        this.router.post('/getMetadata', this.getNftMetadata);
        this.router.get('/getNftGetSeries', this.getNftGetSeries);
        this.router.post('/getNftGetSeries', this.getNftGetSeries);
    }
}
const nearRoutes = new NEARRoutes();
exports.default = nearRoutes.router;
