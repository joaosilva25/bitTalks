import Users from "../models/Users";
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer'


export const findAll = () => {
    return Users.find({})
}

export const createUser = async(username:string,password:string,email:string,codeConfirm:string,token:string,perfil:string)=> {
    const hasEmail = await Users.findOne({email:email})
    const hasUser = await Users.findOne({username:username})

   if(!hasEmail && !hasUser) {
        let userCreate=new Users();
        userCreate.username = username
        userCreate.password = password
        userCreate.email = email
        userCreate.codeConfirm = codeConfirm
        userCreate.token = token
        userCreate.perfil = perfil

        return userCreate
    }
}

export const findPassword = async(passwordText:string,encrypted:string)=> {
    let descriptedPass=bcryptjs.compareSync(passwordText,encrypted)

    console.log('Password Text:', passwordText);
    console.log('Encrypted Password:', encrypted);
    console.log('Resultado da comparação:', descriptedPass);


    return descriptedPass
}

export const findEmail= async(email:string)=> {
    let userSearch=await Users.findOne({email})
    return userSearch
}

export const sendConfirmationEmail = async(email:string,codeCreated:string)=> {
    try {
        var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        let message= {
            from:process.env.GMAIL_EMAIL,
            to:email,
            subject:'confirmation Email',
            html:`<body style="height:400px">
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
        }
        console.log('Email enviado com sucesso')
        let send=await transport.sendMail(message)
        return send
    }
    catch(error) {
        console.log('Erro inesperado com o envio de email')
    }
}

export const deleteUser=async(id:string)=> {
    let deleted=await Users.findOneAndDelete({id:id})
    return deleted
}


export const sendNewPass= async(email:string,token:string)=> {


    try {
        var transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        let message= {
            from:process.env.GMAIL_EMAIL,
            to:email,
            subject:'Redefinir senha',
            html:`<body style="height:400px">
                    <div style="color:#226CAB">
                        <h1 style="font-size: 30px;font-weight:bold">Esqueceu sua senha BitTalks?</h1>
                        <p style="font-size:14px;font-weight:300;margin-bottom:50px;">Clique no botão abaixo para criar sua nova senha de acesso <strong>BitTalks</strong></p></br>
                        <a href="http://localhost:1000/newPassword/create/${token}" style="padding:10px; background-color:#226CAB; box-shadow: 0px 4px 20px 0px #226bab87; color:white; font-weight:bold; border:none; margin-top:50px;text-decoration:none">
                            Clique aqui para redefinir sua senha
                        </a>
                    </div>
                </body>`
        }

        console.log('Email enviado com sucesso')
        let send=await transport.sendMail(message)
        return send

    }
    catch(error) {
        console.log('Erro inesperado com o envio de email')
    }
}