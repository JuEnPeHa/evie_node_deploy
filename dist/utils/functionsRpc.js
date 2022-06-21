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
const { networkId, nodeUrl, walletUrl, helperUrl } = (0, config_1.getConfig)(process.env.NODE_ENV || 'testnet');
var FunctionsRpc;
(function (FunctionsRpc) {
    // const near = new Near({
    //     networkId,
    //     keyStore: new keyStores.InMemoryKeyStore(),
    //     nodeUrl,
    //     walletUrl,
    //     helperUrl,
    //     headers: {}
    // });
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
    ;
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
        // const contract: nearAPI.Contract = new nearAPI.Contract(
        //     account,
        //     receivedContract,
        //     {
        //         viewMethods: ['nft_supply_for_owner'],
        //         changeMethods: []
        //     }
        // );
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
        // const contract: nearAPI.Contract = new nearAPI.Contract(
        //     account,
        //     receivedContract,
        //     {
        //         viewMethods: ['nft_tokens_for_owner'],
        //         changeMethods: []
        //     }
        // );
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
                "media": preToken[0].media || "",
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
    async function getNftTokenPrivate(
    //receivedAccount: string,
    receivedContract, receivedId, account) {
        console.log(receivedId);
        //const account = await near.account(receivedAccount);
        const contract = (0, server_1.getNearContract)(await account, receivedContract, 'nft_token');
        // const contract: nearAPI.Contract = new nearAPI.Contract(
        //     await account,
        //     receivedContract,
        //     {
        //         viewMethods: ['nft_token'],
        //         changeMethods: []
        //     }
        // );
        // @ts-ignore
        const token = await contract.nft_token({
            "token_id": receivedId
        });
        return token;
    }
    ;
    async function getNftGetSeriesIdsPrivate(
    //receivedAccount: string, 
    contract_id, account) {
        const from_index = "0";
        //const account = await near.account(receivedAccount);
        const contract = (0, server_1.getNearContract)(await account, contract_id, 'nft_get_series');
        // const contract: nearAPI.Contract = new nearAPI.Contract(
        //     account,
        //     contract_id,
        //     {
        //         viewMethods: ['nft_get_series'],
        //         changeMethods: []
        //     }
        // );
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
        //  const contract: nearAPI.Contract = new nearAPI.Contract(
        //      account,
        //      "x.paras.near",
        //      //"paras-token-v2.testnet",
        //      {
        //          viewMethods: ['nft_tokens_by_series'],
        //          changeMethods: []
        //      }
        //  );
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
        const dassdsad = await (0, graphql_request_1.request)('https://mintbase-mainnet.hasura.app/v1/graphql', query);
        return dassdsad;
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
