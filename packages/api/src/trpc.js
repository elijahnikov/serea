"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.createTRPCRouter = exports.createCallerFactory = exports.createTRPCContext = void 0;
/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
var server_1 = require("@trpc/server");
var superjson_1 = require("superjson");
var zod_1 = require("zod");
var client_1 = require("@serea/db/client");
var auth_1 = require("@serea/auth");
/**
 * Isomorphic Session getter for API requests
 * - Expo requests will have a session token in the Authorization header
 * - Next.js requests will have a session token in cookies
 */
var isomorphicGetSession = function (headers) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, auth_1.getSession)()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
var createTRPCContext = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var authToken, session, source;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                authToken = (_a = opts.headers.get("Authorization")) !== null && _a !== void 0 ? _a : null;
                return [4 /*yield*/, isomorphicGetSession(opts.headers)];
            case 1:
                session = _c.sent();
                source = (_b = opts.headers.get("x-trpc-source")) !== null && _b !== void 0 ? _b : "unknown";
                console.log(">>> tRPC Request from", source, "by", session === null || session === void 0 ? void 0 : session.user);
                return [2 /*return*/, {
                        session: session,
                        db: client_1.db,
                        token: authToken,
                    }];
        }
    });
}); };
exports.createTRPCContext = createTRPCContext;
/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
var t = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
    errorFormatter: function (_a) {
        var shape = _a.shape, error = _a.error;
        return (__assign(__assign({}, shape), { data: __assign(__assign({}, shape.data), { zodError: error.cause instanceof zod_1.ZodError ? error.cause.flatten() : null }) }));
    },
});
/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
exports.createCallerFactory = t.createCallerFactory;
/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */
/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
exports.createTRPCRouter = t.router;
/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
var timingMiddleware = t.middleware(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var start, waitMs_1, result, end;
    var next = _b.next, path = _b.path;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                start = Date.now();
                if (!t._config.isDev) return [3 /*break*/, 2];
                waitMs_1 = Math.floor(Math.random() * 400) + 100;
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, waitMs_1); })];
            case 1:
                _c.sent();
                _c.label = 2;
            case 2: return [4 /*yield*/, next()];
            case 3:
                result = _c.sent();
                end = Date.now();
                console.log("[TRPC] ".concat(path, " took ").concat(end - start, "ms to execute"));
                return [2 /*return*/, result];
        }
    });
}); });
/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
exports.publicProcedure = t.procedure.use(timingMiddleware);
/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
exports.protectedProcedure = t.procedure
    .use(timingMiddleware)
    .use(function (_a) {
    var _b;
    var ctx = _a.ctx, next = _a.next;
    if (!((_b = ctx.session) === null || _b === void 0 ? void 0 : _b.user)) {
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: __assign(__assign({}, ctx.session), { user: ctx.session.user }),
        },
    });
});
