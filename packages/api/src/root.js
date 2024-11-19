"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var auth_1 = require("./router/auth");
var post_1 = require("./router/post");
var trpc_1 = require("./trpc");
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    auth: auth_1.authRouter,
    post: post_1.postRouter,
});
