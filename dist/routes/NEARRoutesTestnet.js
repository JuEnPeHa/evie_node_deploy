"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const near_api_js_1 = require("near-api-js");
const express_1 = require("express");
//import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores'
const { networkId, nodeUrl, walletUrl, helperUrl, contractName } = (0, config_1.getConfig)(process.env.NODE_ENV || 'testnet');
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
module.exports.nearAccountCallerTestnet = async function nearAccountCallerTestnet() {
    const nearAccountCaller = await near.account(contractName);
    console.log('nearAccountCallerTestnet', await nearAccountCaller.getAccountBalance());
    return await nearAccountCaller;
};
// function getNearContract(account: nearAPI.Account, contractForInteraction: string, method: string): nearAPI.Contract {
//     //console.log('getNearContract', account, contractForInteraction, method, contractName);
//     const contract = new nearAPI.Contract(
//     account,
//     //"x.paras.near",
//     contractForInteraction,
//         {
//             viewMethods: [method],
//             changeMethods: []
//         }
//     );
//     return contract;
// }
class NEARRoutesTestnet {
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
        const listReceivedContractNotEmpties = await functionsRpc_1.FunctionsRpc.getMarketplacesNotEmpties(receivedAccount, listReceivedContractClean, await server_1.nearAccountCallerTestnet);
        const listTokens = await functionsRpc_1.FunctionsRpc.getNftTokensFromListForOwnerPrivate(receivedAccount, listReceivedContractNotEmpties, await server_1.nearAccountCallerTestnet);
        res.json(listTokens);
    }
    async getNftTotalSupply(req, res) {
        console.log(req.body);
        const { receivedAccount, receivedContract } = req.body;
        //console.log( await testNEAR2(receivedAccount, receivedContract));
        //res.json(receivedContract);
        //const account = await near.account(receivedAccount);
        const contract = (0, server_1.getNearContract)(await server_1.nearAccountCallerTestnet, receivedContract, 'nft_total_supply');
        // @ts-ignore
        const totalSupply = await contract.nft_total_supply({});
        res.json(totalSupply);
    }
    async getNftTokensForOwner(req, res) {
        const { receivedAccount, receivedContract } = req.body;
        //const account = await near.account(receivedAccount);
        const contract = (0, server_1.getNearContract)(await server_1.nearAccountCallerTestnet, receivedContract, 'nft_tokens_for_owner');
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
        //const account = await near.account(contractName);
        //console.log("account + nearAccountCaller", account + " " + await nearAccountCaller);
        const contract = (0, server_1.getNearContract)(await server_1.nearAccountCallerTestnet, "paras-token-v2.testnet", 'nft_tokens_by_series');
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
        //const account = await near.account(contractName);
        const contract = (0, server_1.getNearContract)(await server_1.nearAccountCallerTestnet, receivedContract, 'nft_supply_for_owner');
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
        //const account = await near.account(contractName);
        const contract = (0, server_1.getNearContract)(await server_1.nearAccountCallerTestnet, "paras-token-v2.testnet", 'nft_get_series');
        // @ts-ignore
        const series = await contract.nft_get_series({
            "from_index": "0",
            "limit": 100
        });
        res.json(series);
    }
    async getNftGetSeriesSingle(req, res) {
        const { receivedAccount, TokenSeriesId } = req.body;
        //const account = await near.account(contractName);
        //For some reason the await is necessary here
        const contract = (0, server_1.getNearContract)(await server_1.nearAccountCallerTestnet, "paras-token-v2.testnet", 'nft_get_series_single');
        // @ts-ignore
        const series = await contract.nft_get_series_single({
            "token_series_id": TokenSeriesId
        });
        res.json(series);
    }
    //Solo devuelve resultados de Mainnet
    /*La siguiente función no recibe ningún parámetro
    Devuelve una lista de stores en orden de creación
    especificamente devuelve lo siguiente:
    - token_id
    - owner_id de la store
    - titulo
    - media
    - tiempo de creación
    - referencia
    */
    async getLandingPageParas(req, res) {
        let listContracts = ["paras-token-v2.testnet"];
        // { listReceivedContract } = req.body;
        //const receivedAccount = contractName;
        // listReceivedContract.forEach( (i: string) => {
        //     listReceivedContractTyped.push(i);
        // });
        const finalMembersList = await functionsRpc_1.FunctionsRpc.getLandingPageParasPrivate(await server_1.nearAccountCallerTestnet, listContracts);
        res.json(finalMembersList);
    }
    async getMostSelledCollections(req, res) {
        //const receivedAccount = contractName;
        const limit = req.params.limit || 10;
        res.json(await functionsRpc_1.FunctionsRpc.getMostSelledCollectionsPrivate(
        //receivedAccount, 
        limit));
    }
    //Solo devuelve resultados de Mainnet
    /*La siguiente función no recibe ningún parámetro
    pero devuelve una lista de las principales stores
    de mintbase, especificamente devuelve lo siguiente:
    - El nombre de la store
    - El total de valor de las ventas
    - El contrato de la store
    - El account dueño de la store                  */
    async getLandingPageMintbase(req, res) {
        const saibdcnjs = await functionsRpc_1.FunctionsRpc.getLandingPageMintbasePrivate(100);
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
        //this.router.post('/getLandingPageParas', this.getLandingPageParas);
        this.router.get('/getLandingPageMintbase', this.getLandingPageMintbase);
        //this.router.post('/getLandingPageMintbase', this.getLandingPageMintbase);
        this.router.get('/getMostSelledCollections/:limit', this.getMostSelledCollections);
    }
}
const nearRoutesTestnet = new NEARRoutesTestnet();
exports.default = nearRoutesTestnet.router;
