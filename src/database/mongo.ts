import { connect } from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

export const mongoConnect=async()=> {
    try {
        await connect(process.env.MONGO_DB as string)
        console.log('MongoDB connected...')
    }

    catch (err) {
        console.log('Conexão não estabelecida')
    }
}