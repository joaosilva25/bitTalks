"use strict";
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
exports.sendNewPass = exports.deleteUser = exports.sendConfirmationEmail = exports.findEmail = exports.findPassword = exports.createUser = exports.findAll = void 0;
const users_1 = __importDefault(require("../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const findAll = () => {
    return users_1.default.find({});
};
exports.findAll = findAll;
const createUser = (username, password, email, codeConfirm, token, perfil) => __awaiter(void 0, void 0, void 0, function* () {
    const hasEmail = yield users_1.default.findOne({ email: email });
    const hasUser = yield users_1.default.findOne({ username: username });
    if (!hasEmail && !hasUser) {
        let userCreate = new users_1.default();
        userCreate.username = username;
        userCreate.password = password;
        userCreate.email = email;
        userCreate.codeConfirm = codeConfirm;
        userCreate.token = token;
        userCreate.perfil = perfil;
        return userCreate;
    }
});
exports.createUser = createUser;
const findPassword = (passwordText, encrypted) => __awaiter(void 0, void 0, void 0, function* () {
    let descriptedPass = bcrypt_1.default.compareSync(passwordText, encrypted);
    console.log('Password Text:', passwordText);
    console.log('Encrypted Password:', encrypted);
    console.log('Resultado da comparação:', descriptedPass);
    return descriptedPass;
});
exports.findPassword = findPassword;
const findEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    let userSearch = yield users_1.default.findOne({ email });
    return userSearch;
});
exports.findEmail = findEmail;
const sendConfirmationEmail = (email, codeCreated) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var transport = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        });
        let message = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: 'confirmation Email',
            html: `<body style="height:400px">
                    <div style="color:#226CAB">
                        <h1 style="font-size: 30px;font-weight:bold">Bem vindo(a) ao BitTalks !</h1>
                        <p style="font-size:14px;font-weight:300;margin-bottom:50px;">
                            Use o código de segurança abaixo para registrar sua conta BitTalks
                        </p>
                        <div style="padding:10px; background-color:#226CAB; box-shadow: 0px 4px 20px 0px #226bab87; color:white"> 
                            <h1 style="text-align:center">${codeCreated}</h1>
                        </div>
                    </div>
                </body>`
        };
        console.log('Email enviado com sucesso');
        let send = yield transport.sendMail(message);
        return send;
    }
    catch (error) {
        console.log('Erro inesperado com o envio de email');
    }
});
exports.sendConfirmationEmail = sendConfirmationEmail;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let deleted = yield users_1.default.findOneAndDelete({ id: id });
    return deleted;
});
exports.deleteUser = deleteUser;
const sendNewPass = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var transport = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        });
        let message = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: 'Redefinir senha',
            html: `<body style="height:400px">
                    <div style="color:#226CAB">
                        <h1 style="font-size: 30px;font-weight:bold">Esqueceu sua senha BitTalks?</h1>
                        <p style="font-size:14px;font-weight:300;margin-bottom:50px;">Clique no botão abaixo para criar sua nova senha de acesso <strong>BitTalks</strong></p></br>
                        <a href="http://localhost:1000/newPassword/create/${token}" style="padding:10px; background-color:#226CAB; box-shadow: 0px 4px 20px 0px #226bab87; color:white; font-weight:bold; border:none; margin-top:50px;text-decoration:none">
                            Clique aqui para redefinir sua senha
                        </a>
                    </div>
                </body>`
        };
        console.log('Email enviado com sucesso');
        let send = yield transport.sendMail(message);
        return send;
    }
    catch (error) {
        console.log('Erro inesperado com o envio de email');
    }
});
exports.sendNewPass = sendNewPass;
