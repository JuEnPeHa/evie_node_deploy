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
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.params.url);
            const user = yield User_1.default.findOne({ username: req.params.username }).populate('posts');
            res.json(user);
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.default.find();
            res.json(users);
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new User_1.default(req.body) /*.save((err, post) => {})*/;
            //console.log(newPost);
            yield newUser.save( /*(err: any, user: any) => {
                if (err) return res.status(400).json({
                    ok: false,
                    err
                });
                res.json({
                    ok: true,
                    user
                });
            }*/);
            res.json({ data: newUser });
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            //console.log(req.params.url);
            //console.log(req.body);
            const user = yield User_1.default.findOneAndUpdate({ username }, req.body, { new: true });
            res.json(user);
        });
    }
    removeUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            const user = yield User_1.default.findOneAndDelete({ username });
            res.json(user);
        });
    }
    routes() {
        this.router.get('/', this.getUsers);
        this.router.get('/:username', this.getUser);
        this.router.post('/', this.createUser);
        this.router.put('/:username', this.updateUser);
        this.router.delete('/:username', this.removeUser);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
