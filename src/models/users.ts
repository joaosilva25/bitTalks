import { Schema,model,connection } from 'mongoose';


type UsersType= {
    username: string
    email:string
    password:string
    codeConfirm:string
    token:string
    perfil:string
}


const schema = new Schema({
    username: {type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    codeConfirm:{type:String,required:true},
    token:{type:String,required:true},
    perfil:{type:String,required:true},
})

const modelName:string = 'users';

export default (connection && connection.models[modelName])?? model<UsersType>(modelName,schema)