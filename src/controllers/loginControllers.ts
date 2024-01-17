import { NextFunction, Request, Response } from 'express';
import * as UserServices from '../services/UserServices'
import bcryptjs from 'bcryptjs'
import Users from '../models/Users';


export const register= async(req:Request,res:Response)=> {
    
    try {
        let {username,password,email}=req.body

        if(!username && !password && !email) {
            let message = "Completly the inputs to continue"
            res.render('pages/register', {
                message
            })
        }

        let codeAleatory=Math.floor(Math.random()*10000000).toString()
        const token='null'
        let {backgroundOption}=req.body
        let createUser = await UserServices.createUser(username,password,email,codeAleatory,token,backgroundOption)
        let sendEmail=await UserServices.sendConfirmationEmail(email,codeAleatory)


        if (createUser && sendEmail) {
            console.log(`UserCriado: ${createUser.username}`)
            console.log(`emailEnviado:${sendEmail}`)
            if (req.session) {
                let sesh=req.session.usercode=createUser
                console.log(`Session: ${sesh}`)
            }
            res.redirect('/confirmation')
        }

        else {
            let message = "User already registered"
            res.render('pages/register', {
                message
            })
        }
    }
    catch (err) {
         console.log(err)
    }

}


export const login=async(req:Request,res:Response,next:NextFunction)=> {
    let msgForUser;

    const {email,password}=req.body


    const user= await UserServices.findEmail(email)
    console.log(user)


    if(user) {
        console.log("User=OK")
        const comparePass= await UserServices.findPassword(password,user.password)
        console.log(comparePass)
        console.log(user.password)
        console.log(password)
        if(comparePass) {
            if(req.session) {
                if(!req.session.user) {
                    let sesh=req.session.user=user
                    res.redirect('/chat')
                }
                else {
                    let msgForUser='Você já está logado em sua conta'
                    res.render('pages/login', {
                        msgForUser
                    })
                }
            }
        }
        else {
            msgForUser='Incorrect Password try again'
            res.render('pages/login', {
                msgForUser
            })
        }
    }
    else {
        msgForUser='User not already Registered'
        res.render('pages/login', {
            msgForUser
        })
    }

}

export const confirmatedUser=async (req:Request,res:Response)=> {
    let msgForUser;
    let {codeConfirm}=req.body


    if(!codeConfirm) {
        msgForUser="Insira o código para prosseguir"
        res.render('pages/userConfirm', {
            msgForUser
        })
    }

    try {
        if(req.session && req.session.usercode) {
            let seshRestore= await req.session.usercode
            let codeCompare= await req.session.usercode.codeConfirm
            console.log(codeCompare)
            console.log(seshRestore)
            
            if(codeCompare===codeConfirm.toString()) {
                let username= await req.session.usercode.username
                let email= await req.session.usercode.email
                let password=await req.session.usercode.password
                let token=await req.session.usercode.token
                let perfil=await req.session.usercode.perfil

                const hashPassword=bcryptjs.hashSync(password, 10)


                let addUserBD= await UserServices.createUser(username,hashPassword,email,codeCompare,token,perfil)
                await addUserBD.save()

                return res.redirect('/')
            }
            else {
                msgForUser="Código incorreto"
                res.render('pages/userConfirm', {
                    msgForUser
                })
            }
        }
    }

    catch(error) {
        res.status(502).send('Erro de conexão com servidor')
    }


}


export const showHome=async(req:Request,res:Response) => {
    res.render('pages/login')
}

export const showRegister=async(req:Request,res:Response) => {
    res.render('pages/register')
}

export const showConfirmation=async(req:Request,res:Response) => {
    res.render('pages/userConfirm')

}

export const showRegisterNewPass=async(req:Request,res:Response) => {
    let showInput=true
    res.render('pages/newPass', {
        showInput
    })

}

export const showCreateNewPass=async(req:Request,res:Response) => {
    let userToken=req.params.token
    console.log(userToken)

    if(userToken) {
        let tokenUser=await Users.findOne({token:userToken})
        let emailUserToken=tokenUser.email
        if(tokenUser) {
            console.log('Encontrado')
            res.render('pages/newPass', {
                emailUserToken
            })
        }
    }
}


export const testLoggedArea=(req:Request,res:Response) => {

    res.json({logged:'OK'})

}

export const showChat=async(req:Request,res:Response) => {
    res.render('pages/chat')

    console.log(req.session)
}

export const showEditUser=async(req:Request,res:Response) => {
    if (req.session) {
        let userName=req.session.user.username
        let bgUser=req.session.user.perfil

        res.render('pages/editUser', {
            userName,
            bgUser,
        })
    }

}

export const sendEmailNewPass=async(req:Request,res:Response) => {
    let msgForUser;
    let showInput = true;

    let {email}=req.body

    if(!email) {
        msgForUser= 'Preencha os campos para prosseguir'
        return res.render('pages/newPass', {
            msgForUser,
            showInput
        })
    }

    let userTrue=await UserServices.findEmail(email)

    console.log(userTrue)

    let userToken=(Math.random()*250).toString(16)

    
    if(userTrue) {
        console.log(userToken)
        let addToken=await Users.findOneAndUpdate(
            {email:email},
            {token:userToken}
        )

        if (addToken) {
            msgForUser="Email enviado com sucesso"
        
            let sendEmailPass=await UserServices.sendNewPass(email,userToken)

            console.log(`sendedNewPassEmail'${sendEmailPass}`)

            if(req.session) {
                let sesh=req.session.user=userTrue
                console.log(sesh)
            }

            res.render('Pages/newPass', {
                msgForUser,
                showInput,
            })
        }
    }
    else {
        msgForUser='Usuário não encontrado'
        res.render("pages/newPass", {
            msgForUser,
            showInput
        })
    }

}

export const createNewPass=async(req:Request,res:Response) => {
    let showInput=false
    let msgForUser;
    let {email}=req.body
    let {password}=req.body

    let hashPass=bcryptjs.hashSync(password,10)

    if (!password) {
        let emailUserToken=email
        msgForUser="Insira uma senha válida para prosseguir"
        return res.render("pages/newPass",{
            showInput,
            msgForUser,
            emailUserToken
        })
    }

    try {
        let searchUser= await Users.findOne({email})

        if (searchUser) {
            searchUser.password=hashPass
            await searchUser.save()
            console.log("senha alterada com sucesso")
            res.redirect('/')
        }
        else {
            msgForUser="Erro inesperado tente novamente"
            res.render("pages/newPass", {
                showInput,
                msgForUser
            })
        }
    }
    catch(error) {
        res.send('erro')
        console.log('erro')
    }
}

export const editUser=async (req:Request, res:Response)=> {
    let {username,backgroundOption} = req.body


    if(req.session && req.session.user) {
        let userActive=req.session.user.email
        console.log(`u: ${userActive}`)
        let user= await UserServices.findEmail(userActive)

        if(user) {
            user.username = username
            user.perfil = backgroundOption
            user.save()
            let userUpdated=req.session.user=user
            res.redirect('/chat')
        }
    }

}