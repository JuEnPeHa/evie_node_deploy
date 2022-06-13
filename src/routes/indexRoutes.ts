import { Request, Response, Router } from 'express';

class IndexRoutes {
    router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get('/', (req, res) => res.send('<p>Api Mainnet: http://localhost:3000/api/near/mainnet/getLandingPageParas</p> <br> <p>Api Testnet: http://localhost:3000/api/near/testnet/getLandingPageParas</p>'));
    }
}

const indexRoutes = new IndexRoutes();
indexRoutes.routes();

export default indexRoutes.router;