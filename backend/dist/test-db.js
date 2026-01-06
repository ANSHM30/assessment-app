"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./config/db"));
async function testDB() {
    try {
        const result = await db_1.default.query("SELECT NOW()");
        console.log("🟢 DB Time:", result.rows[0]);
        process.exit(0);
    }
    catch (error) {
        console.error("🔴 DB Connection Failed:", error);
        process.exit(1);
    }
}
testDB();
