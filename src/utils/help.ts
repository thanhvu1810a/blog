import * as bcrypt from 'bcrypt'

const salt = 10

export const hashPasswordHelper = async(plaintPassword:string)=>{
    try{
        return await bcrypt.hash(plaintPassword,salt)
    }catch(error){
    }
}