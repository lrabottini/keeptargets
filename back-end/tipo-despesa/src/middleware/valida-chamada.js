import { check } from 'express-validator'
import { TipoDespesa } from '../models/tipo-despesa.js'
import mongoose from 'mongoose'

const validaCampos = [
    check('codigo').trim().notEmpty().withMessage('Código não informado.'),
    check('descricao').trim().notEmpty().withMessage('Descrição não informada.'),
]

const validaParametros = [
    check('org').trim().notEmpty().withMessage('Organização não informada.'),
]

const emUso = async (value, { req }) => {
    /** Consulta se o tipo de despesa está em uso */
    const result = await TipoDespesa.aggregate([
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
                foreignField: 'linha_tipo_de_despesa',
                as: 'linhas',
            }
        }
    ]).exec()
    
    /** Caso o tipo de despesa não esteja em uso, retorna TRUE para a validação
        
    Retorna FALSE se a condição acima não for atendida */
    return result[0].linhas.length === 0?
        Promise.resolve() : 
        Promise.reject(new Error('Tipo de despesa está sendo utilizado, necessário alterar as linhas antes de excluir.'))
}

const validaUso = [
    check('id').custom(emUso)
]

export { validaCampos, validaParametros, validaUso }