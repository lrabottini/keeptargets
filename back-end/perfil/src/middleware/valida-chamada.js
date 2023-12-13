import { check } from 'express-validator'
import mongoose from 'mongoose'
import { Perfil } from '../models/perfil.js'

const compareDates = (value, { req }) => {
    return toFormattedDate(req.body.end) > toFormattedDate(req.body.start) 
}

const hasOrg = [
    check('org').trim().notEmpty().withMessage('Organização não informada.')
]

const emUso = async (value, { req }) => {
    /** Consulta se o centro de custo está em uso */
    const result = await Perfil.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(value)
            }
        }
        /** Faz o lookup para trazer as informações do usuário */
        ,{
            $lookup: {
                from: 'usuario',
                localField: '_id',
                foreignField: 'usuario_perfil',
                as: 'usuarios',
            }
        }
    ]).exec()
    
    /** Caso o centro de custo não esteja em uso, retorna TRUE para a validação
        
    Retorna FALSE se a condição acima não for atendida */
    return result.hasOwnProperty('usuarios')? 
        result[0].usuarios.lenght === 0? 
            Promise.resolve() : 
            Promise.reject(new Error('Perfil está sendo utilizado, necessário migrar usuários para outro perfil antes de excluir.'))
        : Promise.resolve()
    }

const validaUso = [
    check('id').custom(emUso)
]

const fieldValidation = [
    check('descricao').trim().notEmpty().withMessage('Descrição não informada.')
]

export { fieldValidation, hasOrg, validaUso }