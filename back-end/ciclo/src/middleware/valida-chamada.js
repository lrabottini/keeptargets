import { check } from 'express-validator'
import { toFormattedDate } from '@keeptargets/common'
import { Ciclo } from '../models/ciclo.js'

const compareDates = (value, { req }) => {
    return toFormattedDate(req.body.end) >= toFormattedDate(req.body.start) 
}

const hasActive = async (value, { req }) => {
    /** Consulta se já existe um ciclo ativo */
    const result = await Ciclo.find({ciclo_status: 1}).exec()

    /** Caso não exista ciclo ativo, retorna TRUE para a validação
        Caso exista ciclo ativo, a ação seja um UPDATE e o ciclo ativo é o mesmo ciclo que está sendo editado, retorna TRUE para a validação

        Retorna FALSE caso as duas condições acima sejam inválidas */
    const validation = result.length === 0 || result === undefined ? true : req.method ===  'POST' && value === 0? true : req.method === 'PUT' && result[0]._id.toString() === req.params.id

    return validation? Promise.resolve() : Promise.reject(new Error('Já existe um ciclo ativo.'))
}

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

export { fieldValidation, hasOrg }