import { check } from 'express-validator'
import { toFormattedDate } from '@keeptargets/common'
import { Periodo } from '../models/periodo.js'

const compareDates = (value, { req }) => {
    return toFormattedDate(req.body.end) > toFormattedDate(req.body.start) 
}

const hasActive = async (value, { req }) => {
    const result = await Periodo.find({periodo_status: 1})
    const validation = result.length === 0 || result === undefined ? true: req.method === 'PUT' && result[0]._id.toString() === req.params.id? true: false  
    return validation
}

const fieldValidation = [
    check('name').trim().notEmpty().withMessage('Nome não informado.'),
    check('start').trim().notEmpty().withMessage('Início do ciclo não informado.'),
    check('end').trim().notEmpty().withMessage('Fim do ciclo não informado.'),
    check('start').custom(compareDates).withMessage('Data início não pode ser maior que data fim.'),
    check('status').custom(hasActive).withMessage('Já existe um ciclo ativo.')
]

export { fieldValidation }