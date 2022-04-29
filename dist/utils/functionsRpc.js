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
exports.FunctionsRpc = void 0;
const nearAPI = __importStar(require("near-api-js"));
const near_api_js_1 = require("near-api-js");
const config_1 = require("../config");
const { networkId, nodeUrl, walletUrl, helperUrl } = (0, config_1.getConfig)(process.env.NODE_ENV || 'testnet');
var FunctionsRpc;
(function (FunctionsRpc) {
    const near = new near_api_js_1.Near({
        networkId,
        keyStore: new near_api_js_1.keyStores.InMemoryKeyStore(),
        nodeUrl,
        walletUrl,
        helperUrl,
        headers: {}
    });
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
    FunctionsRpc.getMarketplacesClean = getMarketplacesClean;
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
    FunctionsRpc.getMarketplacesNotEmpties = getMarketplacesNotEmpties;
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
    FunctionsRpc.getNftTokensFromListForOwnerPrivate = getNftTokensFromListForOwnerPrivate;
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
    FunctionsRpc.getNftSupplyForOwnerPrivate = getNftSupplyForOwnerPrivate;
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
    FunctionsRpc.getNftTokensForOwnerPrivate = getNftTokensForOwnerPrivate;
    function getLandingPagePrivate(receivedAccount, listMarketplacesParas) {
        return __awaiter(this, void 0, void 0, function* () {
            let listExistentIds = [];
            let listLandingPage = [];
            for (let index = 0; index < listMarketplacesParas.length; index++) {
                const element = listMarketplacesParas[index];
                const nftSeries = yield getNftGetSeriesIdsPrivate(receivedAccount, element);
                listExistentIds.push(nftSeries);
                for (let index = 0; index < nftSeries.length; index++) {
                    const element = nftSeries[index];
                    let preToken = yield getNftTokensBySeriesPrivate(receivedAccount, element.toString());
                    if (preToken != "") {
                        listLandingPage.push(preToken);
                    }
                }
                console.log(nftSeries);
            }
            return listLandingPage;
        });
    }
    FunctionsRpc.getLandingPagePrivate = getLandingPagePrivate;
    function getNftGetSeriesIdsPrivate(receivedAccount, contract_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const from_index = "0";
            const account = yield near.account(receivedAccount);
            const contract = new nearAPI.Contract(account, contract_id, {
                viewMethods: ['nft_get_series'],
                changeMethods: []
            });
            // @ts-ignore
            const series = yield contract.nft_get_series({
                "from_index": from_index,
                "limit": 100
            });
            const max_number = series.length;
            let listExistentIds = [];
            for (let index = 0; index < series.length; index++) {
                const element = series[index];
                listExistentIds.push(element.token_series_id);
            }
            return listExistentIds;
        });
    }
    function getNftTokensBySeriesPrivate(receivedAccount, TokenSeriesId) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield near.account(receivedAccount);
            let tokens = "";
            const contract = new nearAPI.Contract(account, 
            //"x.paras.near",
            "paras-token-v2.testnet", {
                viewMethods: ['nft_tokens_by_series'],
                changeMethods: []
            });
            // @ts-ignore
            yield contract.nft_tokens_by_series({
                "token_series_id": TokenSeriesId,
                //"from_index": "0",
                "limit": 100
            }).then((result) => {
                tokens = result[0];
            }).catch((err) => {
                tokens = "";
            });
            return tokens;
        });
    }
})(FunctionsRpc = exports.FunctionsRpc || (exports.FunctionsRpc = {}));
