"use strict";
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
    async getUser(req, res) {
        //console.log(req.params.url);
        const user = await User_1.default.findOne({ username: req.params.username }).populate('posts');
        res.json(user);
    }
    async getUsers(req, res) {
        const users = await User_1.default.find();
        res.json(users);
    }
    async createUser(req, res) {
        const newUser = new User_1.default(req.body) /*.save((err, post) => {})*/;
        //console.log(newPost);
        await newUser.save( /*(err: any, user: any) => {
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
    }
    async updateUser(req, res) {
        const { username } = req.params;
        //console.log(req.params.url);
        //console.log(req.body);
        const user = await User_1.default.findOneAndUpdate({ username }, req.body, { new: true });
        res.json(user);
    }
    async removeUser(req, res) {
        const { username } = req.params;
        const user = await User_1.default.findOneAndDelete({ username });
        res.json(user);
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
