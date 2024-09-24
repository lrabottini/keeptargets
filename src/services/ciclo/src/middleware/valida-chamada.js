import { check } from 'express-validator'
import { toFormattedDate } from '@keeptargets/common'
import { Ciclo } from '../models/ciclo.js'
import mongoose from 'mongoose'

const compareDates = (value, { req }) => {
    return toFormattedDate(req.body.end) >= toFormattedDate(req.body.start) 
}

const hasActive = async (value, { req }) => {
    /** Consulta se já existe um ciclo ativo */
    const result = await Ciclo.find({ciclo_status: 'ATIVO'}).exec()

    /** Caso não exista ciclo ativo, retorna TRUE para a validação
        Caso exista ciclo ativo, a ação seja um UPDATE e o ciclo ativo é o mesmo ciclo que está sendo editado, retorna TRUE para a validação

        Retorna FALSE caso as duas condições acima sejam inválidas */
    const validation = value === 'ENCERRADO'?
        true: result.length === 0 || result === undefined ? 
            true : req.method === 'PUT'?
                true: result[0]._id.toString() === req.params.id?
                    true: value === "INATIVO"? 
                        true : false

    return validation? Promise.resolve() : Promise.reject(new Error('Já existe um ciclo ativo.'))
}

const hasChildren = async (value, { req }) => {
    /** Consulta se a versão possui filhos */
    const result = await Ciclo.findById(new mongoose.Types.ObjectId(req.params.id)).exec()

    /** Caso o ciclo não possua versões, retorna TRUE para a validação
        
    Retorna FALSE se a condição acima não for atendida */
    return result.ciclo_versoes === 0? Promise.resolve() : 
                                       Promise.reject(new Error('Ciclo possui versões criadas. Necessário excluir as versões antes de excluir o ciclo.'))
}

const childrenValidation = [
    check('versoes').custom(hasChildren)
]

const hasOrg = [
    check('org').trim().notEmpty().withMessage('Organização não informada.')
]

const fieldValidation = [
    check('name').trim().notEmpty().withMessage('Nome não informado.'),
    check('start').trim().notEmpty().withMessage('Início do ciclo não informado.'),
    check('end').trim().notEmpty().withMessage('Fim do ciclo não informado.'),
    check('start').custom(compareDates).withMessage('Data início não pode ser maior que data fim.'),
    check('status').custom(hasActive)
]

export { fieldValidation, hasOrg, childrenValidation }