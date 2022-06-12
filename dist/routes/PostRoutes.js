"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Post_1 = __importDefault(require("../models/Post"));
class PostRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    async getPost(req, res) {
        //console.log(req.params.url);
        const post = await Post_1.default.findOne({ url: req.params.url });
        res.json(post);
    }
    async getPosts(req, res) {
        const posts = await Post_1.default.find();
        res.json(posts);
    }
    async createPost(req, res) {
        //console.log(req.body);
        const { title, url, content, image } = req.body;
        const newPost = new Post_1.default({ title, url, content, image }) /*.save((err, post) => {})*/;
        //console.log(newPost);
        await newPost.save( /*(err: any, post: any) => {
            if (err) return res.status(400).json({
                ok: false,
                err
            });
            res.json({
                ok: true,
                post
            });
        }*/);
        res.json({ data: newPost });
    }
    async updatePost(req, res) {
        const { url } = req.params;
        //console.log(req.params.url);
        //console.log(req.body);
        const post = await Post_1.default.findOneAndUpdate({ url }, req.body, { new: true });
        res.json(post);
    }
    async removePost(req, res) {
        const { url } = req.params;
        const post = await Post_1.default.findOneAndDelete({ url });
        res.json(post);
    }
    routes() {
        this.router.get('/', this.getPosts);
        this.router.get('/:url', this.getPost);
        this.router.post('/', this.createPost);
        this.router.put('/:url', this.updatePost);
        this.router.delete('/:url', this.removePost);
    }
}
const postRoutes = new PostRoutes();
exports.default = postRoutes.router;
