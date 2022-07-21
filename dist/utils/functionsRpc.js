"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionsRpc = void 0;
const config_1 = require("../config");
const StatsParasAPI_1 = __importDefault(require("../models/StatsParasAPI"));
const ParasAPI_1 = __importDefault(require("../models/ParasAPI"));
const graphql_request_1 = require("graphql-request");
const server_1 = require("../server");
const HiggsfieldAPI_1 = __importDefault(require("../models/HiggsfieldAPI"));
const axios_1 = __importDefault(require("axios"));
const { networkId, nodeUrl, walletUrl, helperUrl } = (0, config_1.getConfig)(process.env.NODE_ENV || 'testnet');
var FunctionsRpc;
(function (FunctionsRpc) {
    function getMarketplacesClean(listNftMarketplacesRaw) {
        let listNftMarketplaces = [];
        listNftMarketplacesRaw.forEach((marketplace) => {
            if (marketplace.includes("mintbase") ||
                marketplace.includes("paras") ||
                marketplace.includes("neatar") ||
                marketplace.includes("mintspace") ||
                marketplace.includes("higgsfield")) {
                listNftMarketplaces.push(marketplace);
            }
        });
        return listNftMarketplaces;
    }
    FunctionsRpc.getMarketplacesClean = getMarketplacesClean;
    ;
    async function nftMetadata(account, nearAPI) {
        const contract = (0, server_1.getNearContract)(nearAPI, account, 'nft_metadata');
        // @ts-ignore
        const metadata = await contract.nft_metadata({});
        console.log(metadata);
        return metadata;
    }
    FunctionsRpc.nftMetadata = nftMetadata;
    async function getMarketplacesNotEmpties(account, listNftMarketplacesRaw, nearApiAccount) {
        let listInternNftMarketplaces = [];
        for (let index = 0; index < listNftMarketplacesRaw.length; index++) {
            const element = listNftMarketplacesRaw[index];
            const supply = await getNftSupplyForOwnerPrivate(account, nearApiAccount, element);
            if (supply != "0") {
                listInternNftMarketplaces.push(element);
            }
        }
        return listInternNftMarketplaces;
    }
    FunctionsRpc.getMarketplacesNotEmpties = getMarketplacesNotEmpties;
    ;
    async function getNftTokensFromListForOwnerPrivate(account, listNftMarketplacesNotEmpties, nearApiAccount) {
        let listNfts = [];
        for (let index = 0; index < listNftMarketplacesNotEmpties.length; index++) {
            const element = listNftMarketplacesNotEmpties[index];
            const supply = await getNftTokensForOwnerPrivate(account, element, nearApiAccount);
            listNfts.push(supply);
        }
        return listNfts;
    }
    FunctionsRpc.getNftTokensFromListForOwnerPrivate = getNftTokensFromListForOwnerPrivate;
    ;
    async function getNftSupplyForOwnerPrivate(receivedAccount, account, receivedContract) {
        //const account = await near.account(receivedAccount);
        const contract = (0, server_1.getNearContract)(account, receivedContract, 'nft_supply_for_owner');
        // @ts-ignore
        const supply = await contract.nft_supply_for_owner({
            "account_id": receivedAccount
        });
        console.log("supply");
        console.log(supply);
        return supply;
    }
    FunctionsRpc.getNftSupplyForOwnerPrivate = getNftSupplyForOwnerPrivate;
    ;
    async function getNftTokensForOwnerPrivate(receivedAccount, receivedContract, account) {
        //const account = await near.account(receivedAccount);
        const contract = (0, server_1.getNearContract)(account, receivedContract, 'nft_tokens_for_owner');
        console.log("account: " + account);
        // @ts-ignore
        const supply = await contract.nft_tokens_for_owner({
            "account_id": receivedAccount
        });
        //console.log("supply");
        //console.log(supply);
        return supply;
    }
    FunctionsRpc.getNftTokensForOwnerPrivate = getNftTokensForOwnerPrivate;
    ;
    async function getLandingPageParasPrivate(
    //receivedAccount: string,
    account, listMarketplacesParas) {
        //let listExistentIds = [];
        let listLandingPage = [];
        for (let index = 0; index < listMarketplacesParas.length; index++) {
            const element = listMarketplacesParas[index];
            const nftSeries = await getNftGetSeriesIdsPrivate(element, await account);
            console.log("nftSeries: " + nftSeries);
            //listExistentIds.push(nftSeries);
            for (let index = 0; index < nftSeries.length; index++) {
                const element = nftSeries[index];
                let preToken = await getNftTokensBySeriesPrivate(element.toString(), await account);
                if (preToken != "") {
                    listLandingPage.push(preToken);
                }
            }
            console.log("listLandingPage");
            console.log(nftSeries);
        }
        return listLandingPage;
    }
    FunctionsRpc.getLandingPageParasPrivate = getLandingPageParasPrivate;
    ;
    async function getLandingPageHiggsFieldPrivate(nextId = null, limit = 10, days = 1000, name = "collectables") {
        let response;
        try {
            const { data } = await HiggsfieldAPI_1.default.post('/search/explore_collections', {
                "next_id": nextId,
                "limit": limit,
                "days": days,
                "name": name
            });
            response = data;
            console.log("data :" + data[0]);
        }
        catch (error) {
            console.log(error);
            response = [];
        }
        return response;
    }
    FunctionsRpc.getLandingPageHiggsFieldPrivate = getLandingPageHiggsFieldPrivate;
    async function getLandingPageMintbasePrivate(limit) {
        let listLandingPage = [];
        const query = (0, graphql_request_1.gql) `
    {
        mb_views_top_stores(limit: ${limit}) {
            store_id
		    total
		    owner
		    name
        }
    }`;
        let mbStoreCollection = await graphqlQuery(query);
        console.log("mbStoreCollection: " + mbStoreCollection);
        return mbStoreCollection.mb_views_top_stores;
    }
    FunctionsRpc.getLandingPageMintbasePrivate = getLandingPageMintbasePrivate;
    FunctionsRpc.getNFTData = async (id, contract) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {};
    };
    async function getParasCollectionsWithAPI(limit) {
        const { data } = await StatsParasAPI_1.default.get('/');
        return data;
    }
    FunctionsRpc.getParasCollectionsWithAPI = getParasCollectionsWithAPI;
    ;
    async function getNftSingleCollectionWithFirstAPI(collectionId) {
        const { data } = await ParasAPI_1.default.get(`/collections?collection_id=${collectionId}`);
        console.log(data.data.results[0].collection);
        return data.data.results;
    }
    FunctionsRpc.getNftSingleCollectionWithFirstAPI = getNftSingleCollectionWithFirstAPI;
    async function getMostSelledCollectionsPrivate(
    //receivedAccount: string,
    limit) {
        const collectionsRAW = await getParasCollectionsWithAPI(limit);
        const preUrl = await FunctionsRpc.nftMetadata("x.paras.near", await server_1.nearAccountCallerMainnet);
        console.log("collectionsRAW");
        console.log(collectionsRAW);
        let dataEvie = {
            "results": [],
            "skip": 0,
            "limit": 0,
        };
        let listCollections = {
            "data": dataEvie,
            "status": 1,
        };
        //listCollections.data = {} as DataEvie;
        for (let index = 0; index < /*collectionsRAW.length*/ limit; index++) {
            const element = collectionsRAW[index];
            let preToken = await getNftSingleCollectionWithFirstAPI(element.collection_id);
            // console.log(preToken);
            // console.log("preToken");
            console.log(preToken);
            listCollections.data.results.push({
                "_id": element._id,
                "collection_id": element.collection_id,
                "collection": preToken[0].collection,
                "volume": element.volume,
                "volume_usd": element.volume_usd,
                "total_sales": element.total_sales,
                "total_owners": element.total_owners,
                "total_cards": element.total_cards,
                "avg_price": element.avg_price,
                "avg_price_usd": element.avg_price_usd,
                "description": preToken[0].description || "",
                "media": preUrl.base_uri + preToken[0].media || "",
                "creator_id": preToken[0].creator_id,
            });
        }
        // for (let i = 0; i < collectionsRAW.length; i++) {
        //     const element = collectionsRAW[i];
        //     console.log(element.collection_id);
        //     let preToken = await getNftSingleCollectionWithFirstAPI(element.collection_id);
        //     if (preToken != null) {
        //         listCollections.push(preToken);
        //     }
        // }
        //return listCollections;
        console.log("listCollections:" + listCollections.data.results.length);
        return listCollections;
    }
    FunctionsRpc.getMostSelledCollectionsPrivate = getMostSelledCollectionsPrivate;
    ;
    FunctionsRpc.getNftTokenPrivate = async (account, receivedContract, receivedId) => {
        const mintbase = receivedContract.includes("mintbase");
        const contract = (0, server_1.getNearContract)(await account, receivedContract, 'nft_token');
        console.log("account: " + account);
        let supply;
        try {
            if (!mintbase) {
                // @ts-ignore
                supply = await contract.nft_token({
                    "token_id": receivedId
                });
            }
            else {
                // @ts-ignore
                const preSupply = await contract.nft_token({
                    "token_id": receivedId
                });
                supply = await getNftTokenMintbasePrivate(preSupply);
            }
        }
        catch (error) {
            supply = error;
        }
        return await supply;
    };
    const getNftTokenMintbasePrivate = async (preSupply) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        const base = "https://arweave.net/";
        const arweaveInstance = axios_1.default.create({
            baseURL: base + ((_a = preSupply.metadata) === null || _a === void 0 ? void 0 : _a.reference),
        });
        const { data } = await arweaveInstance.get('');
        const nft = {
            "token_id": (_b = preSupply.token_id) !== null && _b !== void 0 ? _b : "",
            "owner_id": (_c = preSupply.owner_id) !== null && _c !== void 0 ? _c : "",
            "approvedAccountIDS": (_d = preSupply.approved_account_ids) !== null && _d !== void 0 ? _d : {},
            "metadata": {
                "title": (_e = data.title) !== null && _e !== void 0 ? _e : "",
                "description": (_f = data.description) !== null && _f !== void 0 ? _f : "",
                "media": (_g = data.media) !== null && _g !== void 0 ? _g : "",
                "media_hash": (_h = data.media_hash) !== null && _h !== void 0 ? _h : "",
                "copies": (_k = (_j = preSupply.metadata) === null || _j === void 0 ? void 0 : _j.copies) !== null && _k !== void 0 ? _k : 0,
                "issued_at": (_m = (_l = preSupply.metadata) === null || _l === void 0 ? void 0 : _l.issued_at) !== null && _m !== void 0 ? _m : "0",
                "expires_at": (_p = (_o = preSupply.metadata) === null || _o === void 0 ? void 0 : _o.expires_at) !== null && _p !== void 0 ? _p : "0",
                "starts_at": (_r = (_q = preSupply.metadata) === null || _q === void 0 ? void 0 : _q.starts_at) !== null && _r !== void 0 ? _r : "0",
                "updated_at": (_t = (_s = preSupply.metadata) === null || _s === void 0 ? void 0 : _s.updated_at) !== null && _t !== void 0 ? _t : "0",
                "extra": (_v = (_u = preSupply.metadata) === null || _u === void 0 ? void 0 : _u.extra) !== null && _v !== void 0 ? _v : "",
                "reference": (_x = (_w = preSupply.metadata) === null || _w === void 0 ? void 0 : _w.reference) !== null && _x !== void 0 ? _x : "",
                "reference_hash": (_z = (_y = preSupply.metadata) === null || _y === void 0 ? void 0 : _y.reference_hash) !== null && _z !== void 0 ? _z : "",
            }
        };
        return nft;
    };
    async function getNftGetSeriesIdsPrivate(
    //receivedAccount: string, 
    contract_id, account) {
        const from_index = "0";
        //const account = await near.account(receivedAccount);
        const contract = (0, server_1.getNearContract)(await account, contract_id, 'nft_get_series');
        // @ts-ignore
        const series = await contract.nft_get_series({
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
    }
    FunctionsRpc.getNftGetSeriesIdsPrivate = getNftGetSeriesIdsPrivate;
    ;
    async function getNftTokensBySeriesPrivate(
    //receivedAccount: string, 
    TokenSeriesId, account) {
        console.log(TokenSeriesId);
        //const account = await near.account(receivedAccount);
        let tokens = "";
        const contract = (0, server_1.getNearContract)(await account, "x.paras.near", 'nft_tokens_by_series');
        // @ts-ignore
        await contract.nft_tokens_by_series({
            "token_series_id": TokenSeriesId,
            //"from_index": "0",
            "limit": 100
        }).then((result) => {
            tokens = result[0];
        }).catch((err) => {
            tokens = "";
        });
        return tokens;
    }
    FunctionsRpc.getNftTokensBySeriesPrivate = getNftTokensBySeriesPrivate;
    ;
    async function graphqlQuery(query) {
        const resp = await (0, graphql_request_1.request)('https://mintbase-mainnet.hasura.app/v1/graphql', query);
        return resp;
    }
    FunctionsRpc.graphqlQuery = graphqlQuery;
})(FunctionsRpc = exports.FunctionsRpc || (exports.FunctionsRpc = {}));
;
// async function getParasCollectionsWithAPI(limit: number) {
//     const { data } = await parasAPI.get<ParasAPIResponse>('/top-users?__limit=' + limit);
//     return data.data.collections;
//     //console.log(data.data.buyers);
//     //console.log(data.data.collections);
//     //console.log(data.data.limit);
//     //console.log(data.data.skip);
//     //console.log(data.data.sellers);
//     // console.log(resp.status);
//     // console.log(resp.statusText);
//     // console.log(resp.headers);
//     // console.log(resp.config);
//     // console.log(resp.request);
//     // console.log(resp);
// }
// let contract_token_ids = [];
// for (let i = 0; i < collectionsRAW.length; i++) {
//     console.log(collectionsRAW[i].contract_token_ids[i]);
//     for (let e = 0; e < collectionsRAW[i].contract_token_ids.length; e++) {
//         const o = collectionsRAW[i].contract_token_ids[e];
//         //console.log(o);
//         let ascnsija = await getNftTokenPrivate(receivedAccount, "paras-token-v2.testnet", o);
//         console.log(ascnsija);
//     }
// const e = collectionsRAW[i];
// contract_token_ids.push(e.contract_token_ids[i]);
// let ascnsija = await getNftTokenPrivate(receivedAccount, "paras-token-v2.testnet", e.contract_token_ids[i]);
// console.log(ascnsija);
// e.contract_token_ids = contract_token_ids;
//}
//return contract_token_ids;
