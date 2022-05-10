import * as nearAPI from 'near-api-js';
import { keyStores, Near } from "near-api-js";
import { getConfig } from "../config";
import statsParasAPI from '../models/StatsParasAPI';
import {ParasStatsAPIResponse, ParasStatsArray} from '../interfaces/parasStatsResponse';
import parasAPI from '../models/ParasAPI';
import { ParasCollectionAPIResponse, ParasCollectionArray } from '../interfaces/parasCollectionAPIResponse';
const { networkId, nodeUrl, walletUrl, helperUrl } = getConfig(process.env.NODE_ENV || 'mainnet');

export module FunctionsRpc {

const near = new Near({
    networkId,
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl,
    walletUrl,
    helperUrl,
    headers: {}
});

export function getMarketplacesClean(listNftMarketplacesRaw: string[]): string[] {
    let listNftMarketplaces: string[] = [];
        listNftMarketplacesRaw.forEach(
        (marketplace: string) => {
            if (marketplace.includes("mintbase") || 
            marketplace.includes("paras") || 
            marketplace.includes("neatar")  ||
            marketplace.includes("mintspace") ){
                listNftMarketplaces.push(marketplace);
            }
        }
    );
    return listNftMarketplaces;
};

export async function getMarketplacesNotEmpties(account: string, listNftMarketplacesRaw: string[]) : Promise<string[]> {
    let listInternNftMarketplaces: string[] = [];
    for (let index = 0; index < listNftMarketplacesRaw.length; index++) {
        const element = listNftMarketplacesRaw[index];
        const supply = await getNftSupplyForOwnerPrivate(account, element);
            if (supply != "0") {
                listInternNftMarketplaces.push(element);
            }
    }
    return listInternNftMarketplaces;
};

export async function getNftTokensFromListForOwnerPrivate(account: string, listNftMarketplacesNotEmpties: string[]) {
    let listNfts = [];
    for (let index = 0; index < listNftMarketplacesNotEmpties.length; index++) {
        const element = listNftMarketplacesNotEmpties[index];
        const supply = await getNftTokensForOwnerPrivate(account, element);
        listNfts.push(supply);
    }
    return listNfts;
};

export async function getNftSupplyForOwnerPrivate(
    receivedAccount: string,
    receivedContract: string
): Promise<string> {
    const account = await near.account(receivedAccount);
    const contract: nearAPI.Contract = new nearAPI.Contract(
        account,
        receivedContract,
        {
            viewMethods: ['nft_supply_for_owner'],
            changeMethods: []
        }
    );
    // @ts-ignore
    const supply = await contract.nft_supply_for_owner({
        "account_id": receivedAccount
    });
    console.log("supply");
    console.log(supply);
    return supply;
};

export async function getNftTokensForOwnerPrivate(
    receivedAccount: string,
    receivedContract: string
) {
    const account = await near.account(receivedAccount);
    const contract: nearAPI.Contract = new nearAPI.Contract(
        account,
        receivedContract,
        {
            viewMethods: ['nft_tokens_for_owner'],
            changeMethods: []
        }
    );
    // @ts-ignore
    const supply = await contract.nft_tokens_for_owner({
        "account_id": receivedAccount
    });
    //console.log("supply");
    //console.log(supply);
    return supply;
};

export async function getLandingPagePrivate(
    receivedAccount: string,
    listMarketplacesParas: string[]
) {
    //let listExistentIds = [];
    let listLandingPage = [];
    for (let index = 0; index < listMarketplacesParas.length; index++) {
        const element = listMarketplacesParas[index];
        const nftSeries = await getNftGetSeriesIdsPrivate(receivedAccount, element);
        //listExistentIds.push(nftSeries);
        for (let index = 0; index < nftSeries.length; index++) {
            const element = nftSeries[index];
            let preToken = await getNftTokensBySeriesPrivate(receivedAccount, element.toString())
            if (preToken != "") {
                listLandingPage.push(preToken);
            }
        }
        console.log("listLandingPage");
        console.log(nftSeries);
    }
    return listLandingPage;
};

export async function getParasCollectionsWithAPI(limit: number) {
    const { data } = await statsParasAPI.get<ParasStatsArray>('/');
    return data;
};

export async function getNftSingleCollectionWithFirstAPI(collectionId: string) {
    const { data } = await parasAPI.get<ParasCollectionAPIResponse>(`/collections?collection_id=${collectionId}`);
    console.log(data.data.results[0].collection);
    return data;
}

export async function getMostSelledCollectionsPrivate(
    receivedAccount: string,
    limit: number,
) {
    const collectionsRAW = await getParasCollectionsWithAPI(limit);
    //console.log(collectionsRAW);
    let listCollections = [];
    for (let i = 0; i < collectionsRAW.length; i++) {
        const element = collectionsRAW[i];
        console.log(element.collection_id);
        let preToken = await getNftSingleCollectionWithFirstAPI(element.collection_id);
        if (preToken != null) {
            listCollections.push(preToken);
        }
    }
    return listCollections;
};

async function getNftTokenPrivate(receivedAccount: string, receivedContract: string, receivedId: string) {
    console.log(receivedId);
    const account = await near.account(receivedAccount);
    const contract: nearAPI.Contract = new nearAPI.Contract(
        account,
        receivedContract,
        {
            viewMethods: ['nft_token'],
            changeMethods: []
        }
    );
    // @ts-ignore
    const token = await contract.nft_token({
        "token_id": receivedId
    });
    return token;
};

export async function getNftGetSeriesIdsPrivate(receivedAccount: string, contract_id: string) {
    const from_index: string = "0";
    const account = await near.account(receivedAccount);
    const contract: nearAPI.Contract = new nearAPI.Contract(
        account,
        contract_id,
        {
            viewMethods: ['nft_get_series'],
            changeMethods: []
        }
    );
    // @ts-ignore
    const series = await contract.nft_get_series({
        "from_index": from_index,
        "limit": 100
    });
    const max_number = series.length;
    let listExistentIds: number[] = [];
    for (let index = 0; index < series.length; index++) {
        const element = series[index];
        listExistentIds.push(element.token_series_id);
    }
    return listExistentIds;
};

export async function getNftTokensBySeriesPrivate(receivedAccount: string, TokenSeriesId: string): Promise<string> {
    console.log(TokenSeriesId);
      const account = await near.account(receivedAccount);
      let tokens: string = "";
         const contract: nearAPI.Contract = new nearAPI.Contract(
             account,
             "x.paras.near",
             //"paras-token-v2.testnet",
             {
                 viewMethods: ['nft_tokens_by_series'],
                 changeMethods: []
             }
         );
         // @ts-ignore
         await contract.nft_tokens_by_series({
             "token_series_id": TokenSeriesId,
             //"from_index": "0",
             "limit": 100
         }).then(
             (result: string) => {
            tokens = result[0];
             }
         ).catch((err: string) => {
            tokens = "";
         });
            return tokens;
};

};





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
