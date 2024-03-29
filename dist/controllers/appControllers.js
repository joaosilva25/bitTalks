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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = exports.createNewPass = exports.sendEmailNewPass = exports.showEditUser = exports.showChat = exports.testLoggedArea = exports.showCreateNewPass = exports.showRegisterNewPass = exports.showConfirmation = exports.showRegister = exports.showHome = exports.confirmatedUser = exports.login = exports.register = void 0;
const UserServices = __importStar(require("../services/UserServices"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Users_1 = __importDefault(require("../models/Users"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { username, password, email } = req.body;
        if (!username || !password || !email) {
            let message = "Preencha os campos para prosseguir";
            return res.render('pages/register', {
                message
            });
        }
        let codeAleatory = Math.floor(Math.random() * 10000000).toString();
        const token = 'null';
        let { backgroundOption } = req.body;
        let createUser = yield UserServices.createUser(username, password, email, codeAleatory, token, backgroundOption);
        if (createUser) {
            if (req.session) {
                yield UserServices.sendConfirmationEmail(email, codeAleatory);
                let sesh = req.session.usercode = createUser;
            }
            return res.redirect('/confirmation');
        }
        else {
            let message = "Usuário já registrado";
            return res.render('pages/register', {
                message
            });
        }
    }
    catch (err) {
        return res.status(400).json({ error: "Erro inesperado tente novamente mais tarde" });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let msgForUser;
    const { email, password } = req.body;
    const user = yield UserServices.findEmail(email);
    if (email && password) {
        if (user) {
            const comparePass = yield UserServices.findPassword(password, user.password);
            if (comparePass) {
                if (req.session) {
                    if (!req.session.user) {
                        let sesh = req.session.user = user;
                        res.redirect('/chat');
                    }
                    else {
                        let msgForUser = 'Você já está logado em sua conta';
                        return res.render('pages/login', {
                            msgForUser
                        });
                    }
                }
            }
            else {
                msgForUser = 'Senha Incorreta';
                return res.render('pages/login', {
                    msgForUser
                });
            }
        }
        else {
            msgForUser = 'Usuário não registrado';
            return res.render('pages/login', {
                msgForUser
            });
        }
    }
    else {
        msgForUser = 'Preencha os campos para prosseguir';
        return res.render('pages/login', {
            msgForUser
        });
    }
});
exports.login = login;
const confirmatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let msgForUser;
    let { codeConfirm } = req.body;
    if (!codeConfirm) {
        msgForUser = "Insira o código para prosseguir";
        return res.render('pages/userConfirm', {
            msgForUser
        });
    }
    try {
        if (req.session && req.session.usercode) {
            let seshRestore = yield req.session.usercode;
            let codeCompare = yield req.session.usercode.codeConfirm;
            if (codeCompare === codeConfirm.toString()) {
                let username = yield req.session.usercode.username;
                let email = yield req.session.usercode.email;
                let password = yield req.session.usercode.password;
                let token = yield req.session.usercode.token;
                let perfil = yield req.session.usercode.perfil;
                const hashPassword = bcryptjs_1.default.hashSync(password, 10);
                let addUserBD = yield UserServices.createUser(username, hashPassword, email, codeCompare, token, perfil);
                yield addUserBD.save();
                req.session.destroy;
                return res.redirect('/');
            }
            else {
                msgForUser = "Código incorreto";
                res.render('pages/userConfirm', {
                    msgForUser
                });
            }
        }
    }
    catch (error) {
        res.status(502).send('Erro de conexão com servidor');
    }
});
exports.confirmatedUser = confirmatedUser;
const showHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('pages/login');
});
exports.showHome = showHome;
const showRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('pages/register');
});
exports.showRegister = showRegister;
const showConfirmation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('pages/userConfirm');
});
exports.showConfirmation = showConfirmation;
const showRegisterNewPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let showInput = true;
    res.render('pages/newPass', {
        showInput
    });
});
exports.showRegisterNewPass = showRegisterNewPass;
const showCreateNewPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userToken = req.params.token;
    if (userToken) {
        let tokenUser = yield Users_1.default.findOne({ token: userToken });
        let emailUserToken = tokenUser.email;
        if (tokenUser) {
            res.render('pages/newPass', {
                emailUserToken
            });
        }
    }
});
exports.showCreateNewPass = showCreateNewPass;
const testLoggedArea = (req, res) => {
    res.json({ logged: 'OK' });
};
exports.testLoggedArea = testLoggedArea;
const showChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('pages/chat');
});
exports.showChat = showChat;
const showEditUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session) {
        let userName = req.session.user.username;
        let bgUser = req.session.user.perfil;
        res.render('pages/editUser', {
            userName,
            bgUser,
        });
    }
});
exports.showEditUser = showEditUser;
const sendEmailNewPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let msgForUser;
    let showInput = true;
    let { email } = req.body;
    if (!email) {
        msgForUser = 'Preencha os campos para prosseguir';
        return res.render('pages/newPass', {
            msgForUser,
            showInput
        });
    }
    let userTrue = yield UserServices.findEmail(email);
    let userToken = (Math.random() * 250).toString(16);
    if (userTrue) {
        let addToken = yield Users_1.default.findOneAndUpdate({ email: email }, { token: userToken });
        if (addToken) {
            msgForUser = "Email enviado com sucesso";
            let sendEmailPass = yield UserServices.sendNewPass(email, userToken);
            if (req.session) {
                let sesh = req.session.user = userTrue;
            }
            res.render('pages/newPass', {
                msgForUser,
                showInput,
            });
        }
    }
    else {
        msgForUser = 'Usuário não encontrado';
        res.render("pages/newPass", {
            msgForUser,
            showInput
        });
    }
});
exports.sendEmailNewPass = sendEmailNewPass;
const createNewPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let showInput = false;
    let msgForUser;
    let { email } = req.body;
    let { password } = req.body;
    let hashPass = bcryptjs_1.default.hashSync(password, 10);
    if (!password) {
        let emailUserToken = email;
        msgForUser = "Insira uma senha válida para prosseguir";
        return res.render("pages/newPass", {
            showInput,
            msgForUser,
            emailUserToken
        });
    }
    try {
        let searchUser = yield Users_1.default.findOne({ email });
        if (searchUser) {
            searchUser.password = hashPass;
            yield searchUser.save();
            res.redirect('/');
        }
        else {
            msgForUser = "Erro inesperado tente novamente";
            res.render("pages/newPass", {
                showInput,
                msgForUser
            });
        }
    }
    catch (error) {
        res.send('erro');
    }
});
exports.createNewPass = createNewPass;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, backgroundOption } = req.body;
    if (username) {
        if (req.session && req.session.user) {
            let userActive = req.session.user.email;
            let user = yield UserServices.findEmail(userActive);
            if (user) {
                user.username = username;
                if (!backgroundOption) {
                    user.perfil = user.perfil;
                }
                else {
                    user.perfil = backgroundOption;
                }
                user.save();
                let userUpdated = req.session.user = user;
                return res.redirect('/chat');
            }
        }
    }
    else {
        res.redirect('/chat');
    }
});
exports.editUser = editUser;
