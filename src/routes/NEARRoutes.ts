import {getConfig} from '../config';
import * as nearAPI from 'near-api-js';
import { Account, Near, keyStores } from 'near-api-js';
import { parseContract } from 'near-contract-parser';
import { Request, Response, Router } from 'express';
import NEARRequest from '../models/NEARRequest';
//import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores'
const { networkId, nodeUrl, walletUrl, helperUrl } = getConfig(process.env.NODE_ENV || 'testnet');

function getMarketplacesClean(listNftMarketplacesRaw: string[]): string[] {
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
}

async function getMarketplacesNotEmpties(account: string, listNftMarketplacesRaw: string[]) : Promise<string[]> {
    let listInternNftMarketplaces: string[] = [];
    for (let index = 0; index < listNftMarketplacesRaw.length; index++) {
        const element = listNftMarketplacesRaw[index];
        const supply = await getNftSupplyForOwnerPrivate(account, element);
            if (supply != "0") {
                listInternNftMarketplaces.push(element);
            }
    }
    return listInternNftMarketplaces;
}

async function getNftSupplyForOwnerPrivate(
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
}

//testNEAR2();
const near = new Near({
    networkId: 'testnet',
    keyStore: new keyStores.InMemoryKeyStore(),
    nodeUrl,
    walletUrl,
    helperUrl,
    headers: {}
})

class NEARRoutes {
    router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    async getNftMetadata(req: Request, res: Response): Promise<void> {
        //let receivedAccount: string = "";
        //let listReceivedContract: string[] = [];
        //let listReceivedContractClean: string[] = [];
        let listReceivedContractNotEmpties: string[] = [];
        let listTokens: any[] = [];
        let listReceivedContractTyped: string[] = [];
        const { receivedAccount, listReceivedContract } = req.body;
        listReceivedContract.forEach( (i: string) => {
            listReceivedContractTyped.push(i);
        });
        const listReceivedContractClean: string[] = getMarketplacesClean(listReceivedContractTyped);
        listReceivedContractNotEmpties = await getMarketplacesNotEmpties(receivedAccount, listReceivedContractClean);
        console.log(listReceivedContractNotEmpties);
        // @ts-ignore
        //const metadata = contract.nft_metadata({
        //    
        //});
        res.json(listReceivedContractNotEmpties);
    }

    async getNftTotalSupply(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        const { receivedAccount, receivedContract } = req.body;
        //console.log( await testNEAR2(receivedAccount, receivedContract));
        //res.json(receivedContract);
         const account = await near.account(receivedAccount);
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
        const tokens = await contract.nft_tokens_for_owner({
            "account_id": receivedAccount,
            "from_index": "0",
            "limit": 100
        });
        res.json(tokens);
   }

   async getNftSupplyForOwner(req: Request, res: Response): Promise<void> {
        const { receivedAccount, receivedContract } = req.body;
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
        res.json(supply);
   }

   async getAllNftsFromUser(req: Request, res: Response): Promise<void> {
       const { receivedAccount, receivedContract } = req.body;
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
    }
}

const nearRoutes = new NEARRoutes();
export default nearRoutes.router;