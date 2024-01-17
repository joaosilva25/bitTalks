"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    codeConfirm: { type: String, required: true },
    token: { type: String, required: true },
    perfil: { type: String, required: true },
});
const modelName = 'Users';
exports.default = (_a = (mongoose_1.connection && mongoose_1.connection.models[modelName])) !== null && _a !== void 0 ? _a : (0, mongoose_1.model)(modelName, schema, 'users');
