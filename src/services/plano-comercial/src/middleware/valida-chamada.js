import { check } from 'express-validator'
import mongoose from 'mongoose'
import { Organizacao } from '../models/organizacao.js'

/** Valida se a organizacao está em uso */
const emUso = async (value, { req }) => {
    const result = await Organizacao.aggregate([
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
                foreignField: 'linha_fornecedor',
                as: 'linhas',
            }
        }
    ]).exec()
    
    /** Caso o fornecedor não esteja em uso, retorna TRUE para a validação
    Retorna FALSE se a condição acima não for atendida */

    const validation = result[0].hasOwnProperty('linhas')? 
        result[0].linhas.length === 0?
            Promise.resolve() : 
            Promise.reject(new Error('Organização está sendo utilizada.'))
        : Promise.resolve()

    return validation
}

const validaUso = [
    check('id').custom(emUso)
]

const emUsoCNPJ = async (value, { req }) => {
    const result = await Organizacao.find({organizaao_cnpj: value})

    return result.length === 0 || result[0].id === req.params.id ?
        Promise.resolve() : 
        Promise.reject(new Error('CNPJ já está sendo utilizado por outra organizacão.'))
}

const validaCNPJ = [
    check('cnpj').custom(emUsoCNPJ)
]

const fieldValidation = [
    check('nome').trim().notEmpty().withMessage('Nome não informado.'),
    check('cnpj').trim().notEmpty().withMessage('CNPJ não informado.'),
    check('plano').trim().notEmpty().withMessage('Plano não informado.'),
    check('responsavel').trim().notEmpty().withMessage('Responsavel não informado.'),
    check('situacao').trim().notEmpty().withMessage('Situação não informada.'),
    check('expiracao').trim().notEmpty().withMessage('Data de expiracão não informada.'),
]

export { fieldValidation, validaCNPJ, validaUso }