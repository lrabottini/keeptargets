import { check } from 'express-validator'
import { Versao } from '../models/versao.js'
import mongoose from 'mongoose'

const compareDates = (value, { req }) => {
    return toFormattedDate(req.body.end) > toFormattedDate(req.body.start) 
}

const hasChildren = async (value, { req }) => {
    /** Consulta se a versão possui filhos */
    const result = await Versao.findById(new mongoose.Types.ObjectId(req.params.id)).exec()

    /** Caso a versão não possua filhos, retorna TRUE para a validação
        
    Retorna FALSE se a condição acima não for atendida */
    return result.versao_linhas === 0? Promise.resolve() : 
                                       Promise.reject(new Error('Esta versão já está em uso.'))
}

const childrenValidation = [
    check('linhas').custom(hasChildren)
]

const validaCamposCriacao = [
    check('nome').trim().notEmpty().withMessage('Nome não informado.'),
    check('situacao_id').trim().notEmpty().withMessage('Informações da situação não informadas.'),
    check('situacao_nome').trim().notEmpty().withMessage('Informações da situação não informadas.'),
    check('situacao_cor').trim().notEmpty().withMessage('Informações da situação não informadas.'),
    check('responsavel').trim().notEmpty().withMessage('Responsável não informado.'),
    check('estrutura').trim().notEmpty().withMessage('Estrutura não informada.'),
]

const validaCamposAtualizacao = [
    check('nome').trim().notEmpty().withMessage('Nome não informado.'),
    check('situacao_id').trim().notEmpty().withMessage('Informações da situação não informadas.'),
    check('situacao_nome').trim().notEmpty().withMessage('Informações da situação não informadas.'),
    check('situacao_cor').trim().notEmpty().withMessage('Informações da situação não informadas.'),
    check('responsavel').trim().notEmpty().withMessage('Responsável não informado.'),
]

export { validaCamposCriacao, validaCamposAtualizacao, childrenValidation }