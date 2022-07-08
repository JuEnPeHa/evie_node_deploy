import * as nearAPI from 'near-api-js';
import { keyStores, Near, Account } from 'near-api-js';
import { getConfig } from "../config";
import statsParasAPI from '../models/StatsParasAPI';
import {ParasStatsAPIResponse, ParasStatsArray} from '../interfaces/parasStatsResponse';
import parasAPI from '../models/ParasAPI';
import { ParasCollectionAPIResponse, ParasCollectionArray } from '../interfaces/parasCollectionAPIResponse';
import { DataEvie, EvieAPICollectionResponse, ResultEvie } from '../interfaces/evieResponse';
import { request, gql } from 'graphql-request'
import { MintbaseStoresCollection } from '../interfaces/mintbaseStoresCollectionResponse';
import { getNearContract } from '../server';
import { Metadata, NFTData } from '../interfaces/nftData';
import higgsfieldAPI from '../models/HiggsfieldAPI';
import { HiggsfieldCollectionResponse } from '../interfaces/higgsfieldResponse';
import { MintbaseNFTData } from '../interfaces/mintbaseNftData';
import axios, { Axios, AxiosInstance } from 'axios';
import { ArweaveNftResponse } from '../interfaces/arweaveNftResponce';

const { networkId, nodeUrl, walletUrl, helperUrl } = getConfig(process.env.NODE_ENV || 'testnet');

export module FunctionsRpc {

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

export async function getMarketplacesNotEmpties(account: string, listNftMarketplacesRaw: string[], nearApiAccount: nearAPI.Account) : Promise<string[]> {
    let listInternNftMarketplaces: string[] = [];
    for (let index = 0; index < listNftMarketplacesRaw.length; index++) {
        const element = listNftMarketplacesRaw[index];
        const supply = await getNftSupplyForOwnerPrivate(account, nearApiAccount, element);
            if (supply != "0") {
                listInternNftMarketplaces.push(element);
            }
    }
    return listInternNftMarketplaces;
};

export async function getNftTokensFromListForOwnerPrivate(
    account: string, 
    listNftMarketplacesNotEmpties: string[],
    nearApiAccount: nearAPI.Account,
    ) {
    let listNfts = [];
    for (let index = 0; index < listNftMarketplacesNotEmpties.length; index++) {
        const element = listNftMarketplacesNotEmpties[index];
        const supply = await getNftTokensForOwnerPrivate(account, element, nearApiAccount);
        listNfts.push(supply);
    }
    return listNfts;
};

export async function getNftSupplyForOwnerPrivate(
    receivedAccount: string,
    account: nearAPI.Account,
    receivedContract: string
): Promise<string> {
    //const account = await near.account(receivedAccount);
    const contract: nearAPI.Contract = getNearContract(account, receivedContract, 'nft_supply_for_owner');
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
    receivedContract: string,
    account: nearAPI.Account,
) {
    //const account = await near.account(receivedAccount);
    const contract: nearAPI.Contract = getNearContract(account, receivedContract, 'nft_tokens_for_owner');
    console.log("account: " + account);
    // @ts-ignore
    const supply = await contract.nft_tokens_for_owner({
        "account_id": receivedAccount
    });
    //console.log("supply");
    //console.log(supply);
    return supply;
};

export async function getLandingPageParasPrivate(
    //receivedAccount: string,
    account: nearAPI.Account,
    listMarketplacesParas: string[]
) {
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
};

export async function getLandingPageHiggsFieldPrivate(
    nextId: string | null = null, 
    limit: number = 10,
    days: number = 1000,
    name: string = "collectables"
) {
    const { data } = await higgsfieldAPI.post<HiggsfieldCollectionResponse>('/',
    {
        
    })
}

export async function getLandingPageMintbasePrivate(limit: number) {
    let listLandingPage = [];
    const query = gql`
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

export const getNFTData = async (id: string, contract: string): Promise<NFTData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        
    } as NFTData;
}

export async function getParasCollectionsWithAPI(limit: number) {
    const { data } = await statsParasAPI.get<ParasStatsArray>('/');
    return data;
};

export async function getNftSingleCollectionWithFirstAPI(collectionId: string) {
    const { data } = await parasAPI.get<ParasCollectionAPIResponse>(`/collections?collection_id=${collectionId}`);
    console.log(data.data.results[0].collection);
    return data.data.results;
}

export async function getMostSelledCollectionsPrivate(
    //receivedAccount: string,
    limit: number,
) {
    const collectionsRAW = await getParasCollectionsWithAPI(limit);
    console.log("collectionsRAW");
    console.log(collectionsRAW);
    let dataEvie: DataEvie = {
        "results": [],
        "skip": 0,
        "limit": 0,
    }
    let listCollections: EvieAPICollectionResponse = {
        "data": dataEvie,
        "status": 1,
    }
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
};

export const getNftTokenPrivate = async (
    account: nearAPI.Account,    
    receivedContract: string,
    receivedId: string,
): Promise<NFTData | unknown> => {
    const mintbase: boolean = receivedContract.includes("mintbase");
    const contract: nearAPI.Contract = getNearContract(await account, receivedContract, 'nft_token');
    console.log("account: " + account);
    let supply: NFTData | unknown;
    try {
        if (!mintbase) {
        // @ts-ignore
        supply = await contract.nft_token({
        "token_id": receivedId
        });
        } else {
        // @ts-ignore
        const preSupply: MintbaseNFTData = await contract.nft_token({
        "token_id": receivedId
        });
        supply = getNftTokenMintbasePrivate(preSupply);
        }

    } catch (error) {
        supply = error;
    }
    return await supply;
}

const getNftTokenMintbasePrivate = async (
    preSupply: MintbaseNFTData,
): Promise<NFTData> => {
    const base: string = "https://arweave.net/";
    const arweaveInstance: AxiosInstance = axios.create({
        baseURL: base + preSupply.metadata?.reference,
    });
    const { data } = await arweaveInstance.get<ArweaveNftResponse>('');
    const nft: NFTData = {
        "token_id": preSupply.token_id ?? "",
        "owner_id": preSupply.owner_id ?? "",
        "approvedAccountIDS": preSupply.approved_account_ids ?? {},
        "metadata": {
            "title": data.title ?? "",
            "description": data.description ?? "",
            "media": data.media ?? "",
            "media_hash": data.media_hash ?? "",
            "copies": preSupply.metadata?.copies ?? 0,
            "issued_at": preSupply.metadata?.issued_at ?? "0",
            "expires_at": preSupply.metadata?.expires_at ?? "0",
            "starts_at": preSupply.metadata?.starts_at ?? "0",
            "updated_at": preSupply.metadata?.updated_at ?? "0",
            "extra": preSupply.metadata?.extra ?? "",
            "reference": preSupply.metadata?.reference ?? "",
            "reference_hash": preSupply.metadata?.reference_hash ?? "",
        }
    }
    return nft;
}

export async function getNftGetSeriesIdsPrivate(
    //receivedAccount: string, 
    contract_id: string,
    account: nearAPI.Account,
    ) {
    const from_index: string = "0";
    //const account = await near.account(receivedAccount);
    const contract: nearAPI.Contract = getNearContract(await account, contract_id, 'nft_get_series');
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

export async function getNftTokensBySeriesPrivate(
    //receivedAccount: string, 
    TokenSeriesId: string,
    account: nearAPI.Account,
    ): Promise<string> {
    console.log(TokenSeriesId);
      //const account = await near.account(receivedAccount);
      let tokens: string = "";
        const contract: nearAPI.Contract = getNearContract(await account, "x.paras.near", 'nft_tokens_by_series');
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

export async function graphqlQuery(query: string) {
    const resp = await request<MintbaseStoresCollection>('https://mintbase-mainnet.hasura.app/v1/graphql', query)
    return resp;
}

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

 