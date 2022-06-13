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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const nearAPI = __importStar(require("near-api-js"));
const near_api_js_1 = require("near-api-js");
const express_1 = require("express");
//import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores'
const { networkId, nodeUrl, walletUrl, helperUrl, contractName } = (0, config_1.getConfig)(process.env.NODE_ENV || 'mainnet');
const functionsRpc_1 = require("../utils/functionsRpc");
const server_1 = require("../server");
const near = new near_api_js_1.Near({
    networkId,
    keyStore: new near_api_js_1.keyStores.InMemoryKeyStore(),
    nodeUrl,
    walletUrl,
    helperUrl,
    headers: {}
});
module.exports.nearAccountCallerMainnet = async function nearAccountCallerMainnet() {
    const nearAccountCaller = await near.account(contractName);
    console.log('nearAccountCaller', await nearAccountCaller.getAccountBalance());
    return await nearAccountCaller;
};
function getNearContract(account, contractForInteraction, method) {
    const contract = new nearAPI.Contract(account, 
    //"x.paras.near",
    contractForInteraction, {
        viewMethods: [method],
        changeMethods: []
    });
    return contract;
}
class NEARRoutesMainnet {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    async getNftMetadata(req, res) {
        let listReceivedContractTyped = [];
        const { receivedAccount, listReceivedContract } = req.body;
        listReceivedContract.forEach((i) => {
            listReceivedContractTyped.push(i);
        });
        const listReceivedContractClean = functionsRpc_1.FunctionsRpc.getMarketplacesClean(listReceivedContractTyped);
        const listReceivedContractNotEmpties = await functionsRpc_1.FunctionsRpc.getMarketplacesNotEmpties(receivedAccount, listReceivedContractClean);
        const listTokens = await functionsRpc_1.FunctionsRpc.getNftTokensFromListForOwnerPrivate(receivedAccount, listReceivedContractNotEmpties);
        res.json(listTokens);
    }
    async getNftTotalSupply(req, res) {
        console.log(req.body);
        const { receivedAccount, receivedContract } = req.body;
        //console.log( await testNEAR2(receivedAccount, receivedContract));
        //res.json(receivedContract);
        const account = await near.account(contractName);
        const contract = new nearAPI.Contract(account, receivedContract, {
            viewMethods: ['nft_total_supply'],
            changeMethods: []
        });
        // @ts-ignore
        const totalSupply = await contract.nft_total_supply({});
        res.json(totalSupply);
    }
    async getNftTokensForOwner(req, res) {
        const { receivedAccount, receivedContract } = req.body;
        //const account = await near.account(receivedAccount);
        const contract = new nearAPI.Contract(server_1.nearAccountCallerMainnet, receivedContract, {
            viewMethods: ['nft_tokens_for_owner'],
            changeMethods: []
        });
        // @ts-ignore
        const tokens = await contract.nft_tokens_for_owner({
            "account_id": receivedAccount,
            "from_index": "0",
            "limit": 100
        });
        res.json(tokens);
    }
    //    getNEARInstance(method: string, contractId: string,n : nearAPI.Account): nearAPI.Contract {
    //     const contract = new nearAPI.Contract(
    //         await near.account(contractId),
    //         contractId,
    //         // method,
    //         {
    //             viewMethods: [method],
    //             changeMethods: []
    //         }
    //     );
    //    }
    async getNftTokensBySeries(req, res) {
        const { receivedAccount, TokenSeriesId } = req.body;
        const account = await near.account(contractName);
        //console.log("account + nearAccountCaller", account + " " + await nearAccountCaller);
        const contract = getNearContract(account, "paras-token-v2.testnet", 'nft_tokens_by_series');
        // @ts-ignore
        const tokens = await contract.nft_tokens_by_series({
            "token_series_id": TokenSeriesId,
            "from_index": "0",
            "limit": 100
        });
        res.json(tokens);
    }
    async getNftSupplyForOwner(req, res) {
        const { receivedAccount, receivedContract } = req.body;
        const account = await near.account(contractName);
        const contract = getNearContract(account, receivedContract, 'nft_supply_for_owner');
        // @ts-ignore
        const supply = await contract.nft_supply_for_owner({
            "account_id": receivedAccount
        });
        res.json(supply);
    }
    async getAllNftsFromUser(req, res) {
        const { receivedAccount, receivedContract } = req.body;
    }
    async getNftGetSeries(req, res) {
        const { receivedAccount } = req.body;
        const account = await near.account(contractName);
        const contract = getNearContract(account, "paras-token-v2.testnet", 'nft_get_series');
        // @ts-ignore
        const series = await contract.nft_get_series({
            "from_index": "0",
            "limit": 100
        });
        res.json(series);
    }
    async getNftGetSeriesSingle(req, res) {
        const { receivedAccount, TokenSeriesId } = req.body;
        const account = await near.account(contractName);
        const contract = getNearContract(account, "paras-token-v2.testnet", 'nft_get_series_single');
        // @ts-ignore
        const series = await contract.nft_get_series_single({
            "token_series_id": TokenSeriesId
        });
        res.json(series);
    }
    async getLandingPageParas(req, res) {
        let listReceivedContractTyped = [];
        const { listReceivedContract } = req.body;
        const receivedAccount = contractName;
        listReceivedContract.forEach((i) => {
            listReceivedContractTyped.push(i);
        });
        const finalMembersList = await functionsRpc_1.FunctionsRpc.getLandingPageParasPrivate(receivedAccount, listReceivedContractTyped);
        res.json(finalMembersList);
    }
    async getMostSelledCollections(req, res) {
        //const receivedAccount = contractName;
        const limit = req.params.limit || 10;
        res.json(await functionsRpc_1.FunctionsRpc.getMostSelledCollectionsPrivate(
        //receivedAccount, 
        limit));
    }
    async getLandingPageMintbase(req, res) {
        const saibdcnjs = await functionsRpc_1.FunctionsRpc.getLandingPageMintbasePrivate();
        res.json(saibdcnjs);
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
        this.router.get('/getNftGetSeriesSingle', this.getNftGetSeriesSingle);
        this.router.post('/getNftGetSeriesSingle', this.getNftGetSeriesSingle);
        this.router.get('/getNftTokensBySeries', this.getNftTokensBySeries);
        this.router.post('/getNftTokensBySeries', this.getNftTokensBySeries);
        this.router.get('/getLandingPageParas', this.getLandingPageParas);
        this.router.post('/getLandingPageParas', this.getLandingPageParas);
        this.router.get('/getLandingPageMintbase', this.getLandingPageMintbase);
        this.router.post('/getLandingPageMintbase', this.getLandingPageMintbase);
        this.router.get('/getMostSelledCollections/:limit', this.getMostSelledCollections);
    }
}
const nearRoutesMainnet = new NEARRoutesMainnet();
exports.default = nearRoutesMainnet.router;
