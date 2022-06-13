import {getConfig} from '../config';
import * as nearAPI from 'near-api-js';
import { Account, Near, keyStores } from 'near-api-js';
import { parseContract } from 'near-contract-parser';
import { Request, Response, Router } from 'express';
import NEARRequest from '../models/NEARRequest';
//import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores'
const { networkId, nodeUrl, walletUrl, helperUrl, contractName } = getConfig(process.env.NODE_ENV || 'mainnet');
import { FunctionsRpc } from '../utils/functionsRpc';
import { nearAccountCallerMainnet } from '../server';

const near = new Near({
    networkId,
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl,
    walletUrl,
    helperUrl,
    headers: {}
})

module.exports.nearAccountCallerMainnet = async function nearAccountCallerMainnet(): Promise<Account> {
    const nearAccountCaller = await near.account(contractName);
    console.log('nearAccountCaller', await nearAccountCaller.getAccountBalance());
    return await nearAccountCaller;
}

function getNearContract(account: nearAPI.Account, contractForInteraction: string, method: string): nearAPI.Contract {
    const contract = new nearAPI.Contract(
    account,
    //"x.paras.near",
    contractForInteraction,
        {
            viewMethods: [method],
            changeMethods: []
        }
    );
    return contract;
}

class NEARRoutesMainnet {
    router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    async getNftMetadata(req: Request, res: Response): Promise<void> {
        let listReceivedContractTyped: string[] = [];
        const { receivedAccount, listReceivedContract } = req.body;
        listReceivedContract.forEach( (i: string) => {
            listReceivedContractTyped.push(i);
        });
        const listReceivedContractClean: string[] = FunctionsRpc.getMarketplacesClean(listReceivedContractTyped);
        const listReceivedContractNotEmpties: string[] = await FunctionsRpc.getMarketplacesNotEmpties(receivedAccount, listReceivedContractClean);
        const listTokens = await FunctionsRpc.getNftTokensFromListForOwnerPrivate(receivedAccount, listReceivedContractNotEmpties);
        res.json(listTokens);
    }

    async getNftTotalSupply(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const { receivedAccount, receivedContract } = req.body;
        //console.log( await testNEAR2(receivedAccount, receivedContract));
        //res.json(receivedContract);
         const account = await near.account(contractName);
         const contract: nearAPI.Contract = new nearAPI.Contract(
             account,
             receivedContract,
             {
                 viewMethods: ['nft_total_supply'],
                 changeMethods: []
             }
         );
         // @ts-ignore
         const totalSupply = await contract.nft_total_supply({});
         res.json(totalSupply);
    }

   async getNftTokensForOwner(req: Request, res: Response): Promise<void> {
        const { receivedAccount, receivedContract } = req.body;
        //const account = await near.account(receivedAccount);
        const contract: nearAPI.Contract = new nearAPI.Contract(
            nearAccountCallerMainnet,
            receivedContract,
            {
                viewMethods: ['nft_tokens_for_owner'],
                changeMethods: []
            }
        );
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
       const { receivedAccount, TokenSeriesId } = req.body;
         const account = await near.account(contractName);
         //console.log("account + nearAccountCaller", account + " " + await nearAccountCaller);
            const contract: nearAPI.Contract = getNearContract(account, "paras-token-v2.testnet", 'nft_tokens_by_series');
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
        const account = await near.account(contractName);
        const contract: nearAPI.Contract = getNearContract(account, receivedContract, 'nft_supply_for_owner');
        // @ts-ignore
        const supply = await contract.nft_supply_for_owner({
            "account_id": receivedAccount
        });
        res.json(supply);
   }

   async getAllNftsFromUser(req: Request, res: Response): Promise<void> {
       const { receivedAccount, receivedContract } = req.body;
   }

   async getNftGetSeries(req: Request, res: Response): Promise<void> {
        const { receivedAccount } = req.body;
        const account = await near.account(contractName);
        const contract: nearAPI.Contract = getNearContract(account, "paras-token-v2.testnet", 'nft_get_series');
        // @ts-ignore
        const series = await contract.nft_get_series({
            "from_index": "0",
            "limit": 100
        });
        res.json(series);
   }

   async getNftGetSeriesSingle(req: Request, res: Response) {
        const { receivedAccount, TokenSeriesId } = req.body;
        const account = await near.account(contractName);
        const contract: nearAPI.Contract = getNearContract(account, "paras-token-v2.testnet", 'nft_get_series_single');
        // @ts-ignore
        const series = await contract.nft_get_series_single({
            "token_series_id": TokenSeriesId
        });
        res.json(series);
   }

   async getLandingPageParas(req: Request, res: Response): Promise<void> {
       let listReceivedContractTyped: string[] = [];
    const { listReceivedContract } = req.body;
    const receivedAccount = contractName;
    listReceivedContract.forEach( (i: string) => {
        listReceivedContractTyped.push(i);
    });
    const finalMembersList = await FunctionsRpc.getLandingPageParasPrivate(receivedAccount, listReceivedContractTyped);
    res.json(finalMembersList);
}

    async getMostSelledCollections(req: Request, res: Response): Promise<void> {
    //const receivedAccount = contractName;
    const limit = req.params.limit || 10;
    res.json(await FunctionsRpc.getMostSelledCollectionsPrivate(
        //receivedAccount, 
        (limit as number),
        ));
    }

    async getLandingPageMintbase(req: Request, res: Response) {
        const saibdcnjs = await FunctionsRpc.getLandingPageMintbasePrivate();
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
export default nearRoutesMainnet.router;