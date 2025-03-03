"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const PostRoutes_1 = __importDefault(require("./routes/PostRoutes"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const helmet_1 = __importDefault(require("helmet"));
const NEARRoutes_1 = __importDefault(require("./routes/NEARRoutes"));
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const MONGO_URI = 'mongodb+srv://efwcwwwwce:7sPtSf8mzuTAqfGx@cluster0.w0ka0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        const db = yield mongoose_1.default.connect(MONGO_URI || process.env.MONGODB_URI).then(db => console.log('DB connected', db.connection.db.databaseName)).catch(err => console.log(err));
    });
}
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        connectDB();
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use('/api/posts', PostRoutes_1.default);
        this.app.use('/api/users', UserRoutes_1.default);
        this.app.use('/api/near', NEARRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
