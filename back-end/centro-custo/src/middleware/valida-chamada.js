import { check } from 'express-validator'
import { toFormattedDate } from '@keeptargets/common'
import { CentroCusto } from '../models/centro-custo.js'
import mongoose from 'mongoose'

const compareDates = (value, { req }) => {
    return toFormattedDate(req.body.end) > toFormattedDate(req.body.start) 
}

const hasOrg = [
    check('org').trim().notEmpty().withMessage('Organização não informada.')
]

const emUso = async (value, { req }) => {
    /** Consulta se o centro de custo está em uso */
    const result = await CentroCusto.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(value)
            }
        }
        /** Faz o lookup para trazer as informações da linha */
        ,{
            $lookup: {
                from: 'linha',
                localField: '_id',
                foreignField: 'linha_centro_de_custo',
                as: 'linhas',
            }
        }
    ]).exec()
    
    /** Caso o centro de custo não esteja em uso, retorna TRUE para a validação
        
    Retorna FALSE se a condição acima não for atendida */
    return result[0].linhas.length === 0?
        Promise.resolve() : 
        Promise.reject(new Error('Centro de custo está sendo utilizado, necessário alterar as linhas antes de excluir.'))
}

const validaUso = [
    check('id').custom(emUso)
]

const fieldValidation = [
    check('descricao').trim().notEmpty().withMessage('Descrição não informada.'),
    check('codigo').trim().notEmpty().withMessage('Código não informado.'),
    check('parent').trim().notEmpty().withMessage('Parent não informado.')
]

export { fieldValidation, hasOrg, validaUso }