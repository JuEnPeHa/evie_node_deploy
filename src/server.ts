import express from 'express';
import morgan from 'morgan';
//import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import PostRoutes from './routes/PostRoutes';
import UserRoutes from './routes/UserRoutes';
import indexRoutes from './routes/indexRoutes';
import helmet from 'helmet';
import parasAPI from './models/ParasAPI';
import { ParasAPIResponse } from './interfaces/parasResponse';
import * as nearAPI from 'near-api-js';
import NEARRoutesMainnet from './routes/NEARRoutesMainnet';
import NEARRoutesTestnet from './routes/NEARRoutesTestnet';
import { FunctionsRpc } from './utils/functionsRpc';
import NEARRoutes from './routes/NEARRoutes';

var functionsMainnet = require('./routes/NEARRoutesMainnet');
export const nearAccountCallerMainnet: nearAPI.Account = functionsMainnet.nearAccountCallerMainnet();
var functionsTestnet = require('./routes/NEARRoutesTestnet');
export const nearAccountCallerTestnet: nearAPI.Account = functionsTestnet.nearAccountCallerTestnet();

export const getNearContract = (
    account: nearAPI.Account,
     contractForInteraction: string,
      method: string,
      ): nearAPI.Contract => {
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

    // async function connectDB() {
    //     const MONGO_URI = 'mongodb+srv://efwcwwwwce:7sPtSf8mzuTAqfGx@cluster0.w0ka0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
    //     const db = await mongoose.connect(MONGO_URI || process.env.MONGODB_URI).then(db => console.log('DB connected', db.connection.db.databaseName)).catch(err => console.log(err));
    // }

class Server {
    app: express.Application;

    constructor() {
    this.app = express();
    this.config();
    this.routes();
    }

    config() {
        //connectDB();
        //connectParasAPI();
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(morgan('dev'));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes() {
        this.app.use(indexRoutes);
        this.app.use('/api/posts', PostRoutes);
        this.app.use('/api/users', UserRoutes);
        this.app.use('/api/near/mainnet', NEARRoutesMainnet);
        this.app.use('/api/near/testnet', NEARRoutesTestnet);
        this.app.use('/api/near', NEARRoutes);
    }

    async start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
        //FunctionsRpc.nftMetadata("x.paras.near", await nearAccountCallerMainnet);
        
        console.log("Server started + ", await FunctionsRpc.getPriceParasNft("paras-token-v2.testnet", "1604"));
    }

}

const server = new Server();
server.start();
