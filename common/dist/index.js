"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.AuthType = exports.RampStatus = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "RampStatus", { enumerable: true, get: function () { return client_1.RampStatus; } });
Object.defineProperty(exports, "AuthType", { enumerable: true, get: function () { return client_1.AuthType; } });
const zod_1 = require("zod");
// Singleton pattern for PrismaClient
const prismaClientSingleton = () => {
    return new client_1.PrismaClient();
};
// Assign singleton to `prisma`
const prisma = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaClientSingleton();
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
// Export Prisma client as default
exports.default = prisma;
// Example Zod schemas for validation
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    email: zod_1.z.string().email().optional(),
    number: zod_1.z.string(),
});
