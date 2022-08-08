import { Router } from "express";
import { FunctionsRpc } from "../utils/functionsRpc";

class NEARRoutes {
        router: Router;
    constructor() {
                this.router = Router();
                this.routes();

    }

    async getCart(req: any, res: { send: (arg0: string) => void; }) {
        res.send('NEAR API');
    }

    routes() {
        //Añadir parametro user: ?user=
        this.router.get('/getCart', (req, res) => {
            const user = req.query.user?.toString();
            if (typeof user === 'undefined') {
                res.status(400).send('User is not defined');
            } else {
                FunctionsRpc.getCartItems(user);
            }
        });
    }
}

const nearRoutes = new NEARRoutes();
export default nearRoutes.router;