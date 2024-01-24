"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = void 0;
const logoutUser = (req, res) => {
    if (req.session && req.session.user) {
        let sessionActived = req.session.user.username;
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send("Erro em finalizar sessão");
            }
            else {
                res.redirect("/");
            }
        });
    }
    else {
        res.redirect("/");
    }
};
exports.logoutUser = logoutUser;
