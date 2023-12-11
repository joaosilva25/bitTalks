import {Request, Response} from 'express';



export const logoutUser= (req:Request, res:Response) => {

    if (req.session && req.session.user) {
        let sessionActived=req.session.user.username
        console.log(`Sessão apagada:${sessionActived}`)
        req.session.destroy((err)=> {
            if(err) {
                res.status(500).send("Erro em finalizar sessão")
            }
            else {
                res.redirect("/")
            }
        })
    }
    else {
        res.redirect("/")
    }


}