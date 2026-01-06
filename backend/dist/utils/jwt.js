"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
function signJwt(payload) {
    return jsonwebtoken_1.default.sign(payload, config_1.default.JWT_SECRET, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expiresIn: config_1.default.JWT_EXPIRES_IN, // ❗ TS strictness vs jsonwebtoken types
    });
}
