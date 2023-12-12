"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController = __importStar(require("../controllers/loginControllers"));
const logoutController = __importStar(require("../controllers/logoutControllers"));
const routes = (0, express_1.Router)();
routes.get('/', loginController.showHome);
routes.get('/register', loginController.showRegister);
routes.post('/register-send', loginController.register);
routes.get('/loggedArea', loginController.testLoggedArea);
routes.get('/confirmation', loginController.showConfirmation);
routes.post('/confirmation', loginController.confirmatedUser);
routes.post('/login', loginController.login);
routes.get('/newPassword', loginController.showRegisterNewPass);
routes.post('/newPassword', loginController.sendEmailNewPass);
routes.get('/newPassword/create/:token', loginController.showCreateNewPass);
routes.post('/newPassword/create/:token', loginController.createNewPass);
routes.get('/chat', loginController.showChat);
routes.get('/logout', logoutController.logoutUser);
routes.get('/editUser', loginController.showEditUser);
exports.default = routes;
