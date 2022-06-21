import {getConfig} from '../config';
import * as nearAPI from 'near-api-js';
import { Account, Near, keyStores } from 'near-api-js';
import { parseContract } from 'near-contract-parser';
import { Request, Response, Router } from 'express';
import NEARRequest from '../models/NEARRequest';
//import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores'
const { networkId, nodeUrl, walletUrl, helperUrl, contractName } = getConfig(process.env.NODE_ENV || 'testnet');
import { FunctionsRpc } from '../utils/functionsRpc';
import { nearAccountCallerTestnet, getNearContract } from '../server';

const near = new Near({
    networkId,
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl,
    walletUrl,
    helperUrl,
    headers: {}
})

module.exports.nearAccountCallerTestnet = async function nearAccountCallerTestnet(): Promise<Account> {
    const nearAccountCaller: nearAPI.Account = await near.account(contractName);
    console.log('nearAccountCallerTestnet', await nearAccountCaller.getAccountBalance());
    return await nearAccountCaller;
}

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
    router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    async getNftMetadata(req: Request, res: Response): Promise<void> {
        const receivedAccount = req.query.account?.toString() || "";
        let listReceivedContractTyped: string[] = ["paras-token-v2.testnet"];
        const listReceivedContractClean: string[] = FunctionsRpc.getMarketplacesClean(listReceivedContractTyped);
        const listReceivedContractNotEmpties: string[] = await FunctionsRpc.getMarketplacesNotEmpties(receivedAccount, listReceivedContractClean, await nearAccountCallerTestnet);
        const listTokens = await FunctionsRpc.getNftTokensFromListForOwnerPrivate(receivedAccount, listReceivedContractNotEmpties, await nearAccountCallerTestnet);
        res.json(listTokens);
    }

    async getNftTotalSupply(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const { receivedAccount, receivedContract } = req.body;
        //console.log( await testNEAR2(receivedAccount, receivedContract));
        //res.json(receivedContract);
        //const account = await near.account(receivedAccount);
        const contract: nearAPI.Contract = getNearContract(await nearAccountCallerTestnet, receivedContract, 'nft_total_supply');
         // @ts-ignore
        const totalSupply = await contract.nft_total_supply({});
         res.json(totalSupply);
    }

   async getNftTokensForOwner(req: Request, res: Response): Promise<void> {
        const { receivedAccount, receivedContract } = req.body;
        //const account = await near.account(receivedAccount);
        const contract: nearAPI.Contract = getNearContract(await nearAccountCallerTestnet, receivedContract, 'nft_tokens_for_owner');
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

   async getNftTokensBySeries(req: Request, res: Response): Promise<void> {
    const TokenSeriesId = req.query.TokenSeriesId || "1"
            const contract: nearAPI.Contract = getNearContract(await nearAccountCallerTestnet, "paras-token-v2.testnet", 'nft_tokens_by_series');
            // @ts-ignore
            const tokens = await contract.nft_tokens_by_series({
                "token_series_id": TokenSeriesId,
                "from_index": "0",
                "limit": 100
            });
            res.json(tokens);
   }

   async getNftSupplyForOwner(req: Request, res: Response): Promise<void> {
        const { receivedAccount, receivedContract } = req.body;
        //const account = await near.account(contractName);
        const contract: nearAPI.Contract = getNearContract(await nearAccountCallerTestnet, receivedContract, 'nft_supply_for_owner');
        // @ts-ignore
        const supply = await contract.nft_supply_for_owner({
            "account_id": receivedAccount
        });
        res.json(supply);
   }

   async getAllNftsFromUser(req: Request, res: Response): Promise<void> {
       const { receivedAccount, receivedContract } = req.body;
   }

      //Funciona en Mainnet y en Testnet
   /* Devuelve las series de los marketplaces */
   async getNftGetSeries(req: Request, res: Response): Promise<void> {
    const from = req.query.from || "0"
    const limit: number = Number(req.query.limit) || 100
        //const account = await near.account(contractName);
        const contract: nearAPI.Contract = getNearContract(await nearAccountCallerTestnet, "paras-token-v2.testnet", 'nft_get_series');
        // @ts-ignore
        const series = await contract.nft_get_series({
            "from_index": from,
            "limit": limit
        });
        res.json(series);
   }

      //Funciona en mainnet y testnet
   /* Devuelve un solo token solicitado por su TokenSeriesId            */
   async getNftGetSeriesSingle(req: Request, res: Response) {
    const TokenSeriesId = req.query.TokenSeriesId || "1"
    //For some reason the await is necessary here
        const contract: nearAPI.Contract = getNearContract(await nearAccountCallerTestnet, "paras-token-v2.testnet", 'nft_get_series_single');
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
   async getLandingPageParas(req: Request, res: Response): Promise<void> {
       let listContracts: string[] = ["paras-token-v2.testnet"];
    const finalMembersList = await FunctionsRpc.getLandingPageParasPrivate(await nearAccountCallerTestnet, listContracts);
    res.json(finalMembersList);
    }

        //Solo funciona en Mainnet
    //Devuelve las collecciones más vendidas por órden de volumen
    /* Devuelve lo siguiente:
    - _id del resultado
    - collection_id
    - volumen en near
    - volumen en usd
    - ventas totales
    - cartas totales
    - precio promedio near
    - precio promedio usd
    - descripción
    - id del dueño de la colección
    ejemplo:
                "_id": "61f0a9c8e0af1a189dd17416",
				"collection_id": "asac.near",
				"collection": "Antisocial Ape Club",
				"volume": "274189644148383769689990000000",
				"volume_usd": 3218059.059615341,
				"total_sales": 3868,
				"total_owners": 1239,
				"total_cards": 3329,
				"avg_price": "70886671186241925979831954",
				"avg_price_usd": 831.9697672221668,
				"description": "A collection of 3333 pixel art ape NFTs stored on the NEAR blockchain.",
				"media": "bafybeigc6z74rtwmigcoo5eqcsc4gxwkganqs4uq5nuz4dwlhjhrurofeq",
				"creator_id": "asac.near"                                           */
    async getMostSelledCollectionsParas(req: Request, res: Response): Promise<void> {
    const limit = req.params.limit || 10;
    res.json(await FunctionsRpc.getMostSelledCollectionsPrivate(
        (limit as number),
        ));
    }

    //Solo devuelve resultados de Mainnet
    /*La siguiente función no recibe ningún parámetro
    pero devuelve una lista de las principales stores
    de mintbase, especificamente devuelve lo siguiente:
    - El nombre de la store
    - El total de valor de las ventas
    - El contrato de la store
    - El account dueño de la store                  */
    async getLandingPageMintbase(req: Request, res: Response) {
        const landingPage = await FunctionsRpc.getLandingPageMintbasePrivate(100);
        res.json(landingPage);
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

        /* Añadir 2 parametros query al final: ?from={CAULQUIERNUMEROVALIDO}?limit={CUALQUIERNUMEROVALIDO} */
        this.router.get('/getNftGetSeries', this.getNftGetSeries);
        // this.router.post('/getNftGetSeries', this.getNftGetSeries);
        
        /* Añadir 1 parametro query al final: ?TokenSeriesId={CUALQUIERNUMEROVALIDO}*/
        this.router.get('/getNftGetSeriesSingle', this.getNftGetSeriesSingle);
        // this.router.post('/getNftGetSeriesSingle', this.getNftGetSeriesSingle);

        /* Añadir 1 parametro query al final: ?TokenSeriesId={CUALQUIERNUMEROVALIDO}*/
        this.router.get('/getNftTokensBySeries', this.getNftTokensBySeries);
        //this.router.post('/getNftTokensBySeries', this.getNftTokensBySeries);

        this.router.get('/getLandingPageParas', this.getLandingPageParas);
        //this.router.post('/getLandingPageParas', this.getLandingPageParas);

        this.router.get('/getLandingPageMintbase', this.getLandingPageMintbase);
        //this.router.post('/getLandingPageMintbase', this.getLandingPageMintbase);

        this.router.get('/getMostSelledCollections/:limit', this.getMostSelledCollectionsParas);
    }
}

const nearRoutesTestnet = new NEARRoutesTestnet();
export default nearRoutesTestnet.router;