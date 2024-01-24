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
const appController = __importStar(require("../controllers/appControllers"));
const logoutController = __importStar(require("../controllers/logoutControllers"));
const routes = (0, express_1.Router)();
routes.get('/', appController.showHome);
routes.get('/register', appController.showRegister);
routes.post('/register-send', appController.register);
routes.get('/loggedArea', appController.testLoggedArea);
routes.get('/confirmation', appController.showConfirmation);
routes.post('/confirmation', appController.confirmatedUser);
routes.post('/login', appController.login);
routes.get('/newPassword', appController.showRegisterNewPass);
routes.post('/newPassword', appController.sendEmailNewPass);
routes.get('/newPassword/create/:token', appController.showCreateNewPass);
routes.post('/newPassword/create/:token', appController.createNewPass);
routes.get('/chat', appController.showChat);
routes.get('/logout', logoutController.logoutUser);
routes.get('/editUser', appController.showEditUser);
routes.post('/editUser', appController.editUser);
exports.default = routes;
